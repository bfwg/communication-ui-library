# Adding features to be released in the beta channel (only)

The primary NPM package released from this repository is @azure/communication-react.

We maintain two "release channels" for this package.

* Stable releases - follow semantic versioning, e.g. 1.0.0
* Beta releases - do not follow sematnic versioning. These are packages with a `-beta.X` suffix, e.g. 1.0.1-beta.3

Our beta releases often carry features that are not yet stabilized. A feature may be restricted to beta channel for
one of two reasons.

* A feature that is actively being developed. Feature will be released in a stable package once it is beta-tested.
* A feature that depends on a feature from underlying Azure Communication Service features that are in themselves in the beta phase.
  This feature can only be released in a stable package once the underlying features are released in a stable package.

The key difference from many standard NPM packages is that some features can stay in the beta packages across intervening stable package releases.

# Conditional compilation

We follow a green-trunk development practice. This means that all development happens on the `main` branch, and all releases are generated by creating short-lived branches off of `main`. The need to carry some features that are released in the beta channel but not in intervening stable package releases means that we need a way to enable / disable these features in the releases. Additionally, we need to be able to switch between beta and stable dependencies for underlying Azure Communication Service libraries.

We achieve this by conditionally compiling away code to drop features from the stable package release.

All build, test, local development server scripts can compile the code in this repository in one of two flavors:

* `beta`: This is the default build flavor. It includes all code in the packges, and depends on the beta flavors of some of our dependencies.
* `stable`: Conditionally compiled code is removed when building this flavor. It also depends on only the stable flavors of our dependencies.

# Tooling

To switch between flavors:

```bash
rush switch-flavor:stable
# Need to rebuild from scratch because that command cleans all build caches.
rush build
```

To switch back to beta flavor:

```bash
rush switch-flavor:beta
# Need to rebuild from scratch because that command cleans all build caches.
rush build
```

All the build tooling is aware of build flavor and works as expected:

```bash
rush build
rush test
rush lint
# ... etc.
```

Similarly, commands you use to work on a packlet locally, continue to work for both flavors:

```bash
cd samples/Chat
rushx build
rushx test
rushx start
# ... etc.
```

This is especially useful because `rush build` may hide detailed errors upon failure.

The only exception is `rush update`. There is a separate command to update dependencies for stable flavored build:

```bash
rush update:stable
```

# Conditionally adding a feature

You must first define your new feature by adding it to the [`features` list in this config file](../../common/config/babel/.babelrc.js).

This repository contains a [live document](../../packages/acs-ui-common/src/conditional-compilation-sample/index.tsx) that describes how you can then add code that is conditionally compiled, and also walks through common scenarios you might encounter when trying to add a beta-only
feature.

## Stabilizing a feature

Careful scoping of defined features will allow you to easily stabilize the feature. When you are ready to add your feature to the stable build:

- One-step stabilization: Include all associated conditionally compiled code in the stable flavored build by moving your feature to `stabilizedFeatures` in the [defined features config file]((../../common/config/babel/.babelrc.js)).
  - Switch to stable flavor and build, test and run samples to try out your stabilized feature.
  - You will also get the updated API files for the stable build from this step. You can use this for API review.
- Clean up: Once your feature is shipped in a stable release, remove all references to conditional compilation directive for your feature, and remove your feature from `stabilizedFeatures` list.
  - Note: If some code has other conditional compilation directives along with your (now stable) feature, remove all directives (not only yours), so that the code is included in the stable flavor build unconditionally.

This [example PR](https://github.com/Azure/communication-ui-library/pull/1547) for stabilizing a feature includes the [generated API diff](https://github.com/Azure/communication-ui-library/pull/1547/files#diff-e76b64bd635283f256ec46065d2e58b277d9fad73ff4e4a774e4509c0290acfe) for this feature.

This [example PR](https://github.com/Azure/communication-ui-library/pull/1846) cleans up previously stabilized feature flag.

# Releases

Conditional compilation necessitates a few extra steps when we release a package:

* Remove beta-only code: This is taken care of by the same tooling that we use `rush switch-flavor:stable && rush build`
* Change dependencies to be the beta vs stable versions

Both of these steps are implemented in the GitHub actions that create a release branch.

You an help with the manual step of figuring out what the CHANGELOG is in each release. When running `rush changelog`, use the change type

* `prerelease` for a change that affects only the beta flavor build
* `patch`, `minor` or `major` for changes that affect the stable (and of course beta) flavor build as appropriate.
* `none` for documentation changes etc that don't affect the NPM bundle meaningfully.

# Conditionally Adding a E2E test

Conditional compilation creates a problem with the e2e tests. The tests themselves are not actually conditionally compiled, while the applications themselves are served in the different flavors.

So when adding a new test to the suite keep this in mind and use the following call:

```TypeScript
test.skip(isTestProfileStableFlavor());
```

The `isTestProfileStableFlavor()` function is checking the environment variables of the session to check what flavor it is running in since it wont conditionally compile the test out.
