// jest.setup.js

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-native-firebase/analytics', () =>
  jest.fn().mockImplementation(() => ({
    logEvent: jest.fn(),
  })),
);