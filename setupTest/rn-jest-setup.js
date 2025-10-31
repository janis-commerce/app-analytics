/**
 * Custom React Native Jest setup with performance property fix
 * Based on react-native/jest/setup.js but modified for Node 18+
 */

'use strict';

// Fix for Node 18+ where performance is read-only
if (global.performance) {
  try {
    delete global.performance;
  } catch (e) {
    // Ignore if we can't delete it
  }
}

// Now set up the mock performance object
global.performance = {
  now: jest.fn(Date.now),
};

// Load React Native's polyfills
try {
  jest.requireActual('@react-native/polyfills/Object.es8');
  jest.requireActual('@react-native/polyfills/error-guard');
} catch (e) {
  // Older versions of React Native may not have these
}

global.__DEV__ = true;
global.Promise = jest.requireActual('promise');
global.regeneratorRuntime = jest.requireActual('regenerator-runtime/runtime');
global.window = global;

global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};
