// Polyfill to fix performance property issue with newer Node versions
// This must run before React Native's setup.js

// Store the original performance object
const originalPerformance = global.performance;

// Delete the read-only property
try {
  delete global.performance;
} catch (e) {
  // If delete fails, try to redefine it
  Object.defineProperty(global, 'performance', {
    writable: true,
    configurable: true,
    value: undefined
  });
  delete global.performance;
}

// Restore it as a writable property
global.performance = originalPerformance;
