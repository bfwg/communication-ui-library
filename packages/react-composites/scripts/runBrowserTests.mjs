#!/usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { exec } from './common.mjs';
import child_process from 'child_process';
import path from 'path';
import { quote } from 'shell-quote';
import { fileURLToPath } from 'url';
import yargs from 'yargs/yargs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKLET_ROOT = path.join(__dirname, '..');
const TEST_ROOT = path.join(PACKLET_ROOT, 'tests', 'browser');
const TESTS = {
  hermetic: {
    call: path.join(TEST_ROOT, 'call', 'hermetic'),
    chat: path.join(TEST_ROOT, 'chat', 'hermetic')
  },
  live: {
    call: path.join(TEST_ROOT, 'call', 'live'),
    chat: path.join(TEST_ROOT, 'chat', 'live'),
    callWithChat: path.join(TEST_ROOT, 'callWithChat')
  }
};
const PLAYWRIGHT_CONFIG = {
  hermetic: path.join(PACKLET_ROOT, 'playwright.config.hermetic.ts'),
  live: path.join(PACKLET_ROOT, 'playwright.config.live.ts')
};
const PLAYWRIGHT_PROJECT = {
  desktop: 'Desktop Chrome',
  'mobile-portrait': 'Mobile Android Portrait',
  'mobile-landscape': 'Mobile Android Landscape'
};

async function main(argv) {
  const args = parseArgs(argv);
  if (args.stress) {
    await runStress(args);
  } else {
    await runAll(args);
  }
}

async function runStress(args) {
  let failureCount = 0;
  for (let i = 0; i < args.stress; i++) {
    try {
      await runAll(args);
    } catch (e) {
      failureCount += 1;
      console.log('Test failed with', e);
    }
  }
  console.log(`### STRESS TEST ${args.stress - failureCount} succeeded out of ${args.stress} attempts ###`);
  if (failureCount > 0) {
    throw new Error('stress test failed');
  }
}

async function runAll(args) {
  for (const composite of args.composites) {
    await runOne(args, composite, 'hermetic');
  }
  if (!args.hermeticOnly) {
    for (const composite of args.composites) {
      await runOne(args, composite, 'live');
    }
  }
}

async function runOne(args, composite, hermeticity) {
  const test = TESTS[hermeticity][composite];
  if (!test) {
    return;
  }

  const env = {
    ...process.env,
    COMMUNICATION_REACT_FLAVOR: args.buildFlavor
  };

  const cmdArgs = ['npx', 'playwright', 'test', '-c', PLAYWRIGHT_CONFIG[hermeticity], test];
  if (args.update) {
    cmdArgs.push('--update-snapshots');
  }
  if (args.projects) {
    for (const project of args.projects) {
      cmdArgs.push('--project', PLAYWRIGHT_PROJECT[project]);
    }
  }
  if (args.debug) {
    cmdArgs.push('--debug');
    env['LOCAL_DEBUG'] = true;
  }
  cmdArgs.push(...args['_']);

  const cmd = quote(cmdArgs);
  if (args.dryRun) {
    console.log(`DRYRUN: Would have run ${cmd}`);
  } else {
    await exec(cmd, env);
  }
}

function parseArgs(argv) {
  const args = yargs(argv.slice(2))
    .usage(
      '$0 [options]',
      'Use this script to run end-to-end tests for this packlet.' +
        '\nThis script invokes playwright with packlet specific configuration & flags.' +
        '\n\nAll arguments after `--` are forwarded to `playwright`.'
    )
    .example([
      ['$0 -l', 'Run only hermetic tests. Most useful for local development cycle.'],
      ['$0 -c call', 'Run only CallComposite tests. Used by CI to shard out tests by composite.'],
      [
        '$0 -b stable',
        'Run tests for stable flavor build. You can also set the COMMUNICATION_REACT_FLAVOR as is done by package.json invocations.'
      ],
      [
        '$0 -- --debug',
        'Run `playwright` in debug mode with Playwright inspector. This is the recommended way to debug e2e tests.'
      ],
      [
        '$0 -c call -p desktop -s 10',
        'Run CallComposite tests on Desktop Chrome 10 times and report success count. Usually a single test should be enabled using `test.only`.'
      ]
    ])
    .options({
      buildFlavor: {
        alias: 'b',
        type: 'string',
        choices: ['beta', 'stable'],
        describe:
          'Run tests against the specified build flavor.' +
          ' Default: `beta`' +
          ' Overrides the COMMUNICATION_REACT_FLAVOR environment variable.\n'
      },
      composites: {
        alias: 'c',
        type: 'array',
        choices: ['call', 'chat', 'callWithChat'],
        describe: 'One or more composites to test. By default, all composites will be tested.\n'
      },
      debug: {
        alias: 'd',
        type: 'boolean',
        describe:
          'Run in debug mode.\n' +
          'Launches playwright inspector and relaxes timeouts to allow single stepping through the test.\n' +
          'This mode must be used on a machine with display support.'
      },
      dryRun: {
        alias: 'n',
        type: 'boolean',
        describe: 'Print what tests would be run without invoking test harness.'
      },
      hermeticOnly: {
        alias: 'l',
        type: 'boolean',
        default: false,
        describe: 'Run only hermetic tests. By default both hermetic and live tests will be run.\n'
      },
      projects: {
        alias: 'p',
        type: 'array',
        choices: ['desktop', 'mobile-portrait', 'mobile-landscape'],
        description: 'Choose playwright projects to run. By default, all projects will be run.\n'
      },
      stress: {
        alias: 's',
        type: 'number',
        describe:
          'Repeat execution a number of times and report failure count. Useful for stabilizing a new / flakey test.\n' +
          'You should to enable just one test to stress via `test.only`.\n'
      },
      update: {
        alias: 'u',
        type: 'boolean',
        default: false,
        describe: 'Update the test snapshots. In this mode, snapshot conflicts do not cause test failures.\n'
      }
    })
    .parseSync();

  if (!args.buildFlavor) {
    args.buildFlavor = process.env['COMMUNICATION_REACT_FLAVOR'] || 'beta';
  }
  if (!args.composites) {
    args.composites = ['call', 'chat', 'callWithChat'];
  }
  return args;
}

await main(process.argv);
