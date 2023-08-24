// jest.setup.js

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-native-firebase/analytics', () =>
  jest.fn().mockImplementation(() => ({
    logEvent: jest.fn(),
  })),
);

jest.mock('@janiscommerce/apps-helpers', () => {
  const lib = jest.requireActual('@janiscommerce/apps-helpers');
  return {
    ...lib,
  };
});
