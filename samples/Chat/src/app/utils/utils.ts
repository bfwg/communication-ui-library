// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

declare let __BUILDTIME__: string; // Injected by webpack
declare let __CHATVERSION__: string; // Injected by webpack
declare let __COMMUNICATIONREACTVERSION__: string; //Injected by webpack

export const getChatSDKVersion = (): string => __CHATVERSION__;
export const getBuildTime = (): string => __BUILDTIME__;
export const getCommnicationReactSDKVersion = (): string => __COMMUNICATIONREACTVERSION__;
export const CAT = '🐱';
export const MOUSE = '🐭';
export const KOALA = '🐨';
export const OCTOPUS = '🐙';
export const MONKEY = '🐵';
export const FOX = '🦊';

export const getBackgroundColor = (avatar: string): { backgroundColor: string } => {
  switch (avatar) {
    case CAT:
      return {
        backgroundColor: 'rgb(255, 250, 228)'
      };
    case MOUSE:
      return {
        backgroundColor: 'rgb(232, 242, 249)'
      };
    case KOALA:
      return {
        backgroundColor: 'rgb(237, 232, 230)'
      };
    case OCTOPUS:
      return {
        backgroundColor: 'rgb(255, 240, 245)'
      };
    case MONKEY:
      return {
        backgroundColor: 'rgb(255, 245, 222)'
      };
    case FOX:
      return {
        backgroundColor: 'rgb(255, 231, 205)'
      };
    default:
      return {
        backgroundColor: 'rgb(255, 250, 228)'
      };
  }
};
