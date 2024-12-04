import {getUserInfo} from '@janiscommerce/oauth-native';
import * as deviceInfo from '@janiscommerce/app-device-info';
import Analytics from '../lib/analytics';
import userInfoEvent from '../lib/userInfoEvent';
import actionEvent from '../lib/actionEvent';
import customEvent from '../lib/customEvent';
import screenViewEvent from '../lib/screenViewEvent';

jest.mock('../lib/userInfoEvent');
jest.mock('../lib/actionEvent');
jest.mock('../lib/customEvent');
jest.mock('../lib/screenViewEvent');

const userInfoResponse = {
  appClientId: 'abcd1234-1234-g4g4-828b-BFAS2121fjA',
  aud: 'abcd1234-1234-g4g4-828b-BFAS2121fjA',
  createdAt: '2020-12-14T18:45:28.306Z',
  email: 'janis@janis.im',
  exp: 1697285104,
  family_name: 'SRL',
  given_name: 'janis',
  iat: 1697112304,
  images: {
    big: 'https://www.gravatar.com/avatar/034caa1d46010b8624d1b8cffaee9a88?d=404&s=512',
  },
  isDev: true,
  iss: 'https://id.janisdev.in',
  locale: 'en-US',
  mainColor: '#e70c6e',
  name: 'Janis SRL',
  profileName: 'Admin',
  refId: null,
  secondaryColor: '#fbfaf8',
  sub: '5fd7b2c8d71fb1e2743bb64e',
  tcode: 'validtcode',
  tcurrency: 'ARS',
  tcurrencyDisplay: 'symbol',
  tid: '631fab63f3f96415abfeabd8',
  timage:
    'https://cdn.id.janisdev.in/client-images/631fab63f3f96415abfeabd8/b25d5d55-52a5-41f8-bf22-43fc0963c875.png',
  tname: 'Fizzmod',
  updated_at: 1697053475,
};

describe('Analytics class', () => {
  const spyGetUserInfo = jest.spyOn({getUserInfo}, 'getUserInfo');
  const spyGetNetworkState = jest.spyOn(deviceInfo, 'getNetworkState');
  const spyGetUniqueId = jest.spyOn(deviceInfo, 'getUniqueId');
  const spyGetScreenMeasurements = jest.spyOn(
    deviceInfo,
    'getDeviceScreenMeasurements',
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('return methods to send events to analytics', () => {
    it('once handler is instantiated methods are available', () => {
      const analytics = new Analytics({appVersion: '1.22.0.0'});

      expect(typeof analytics.sendAction).toBe('function');
    });
  });

  describe('initialize method return', () => {
    it('event data is returned without executing getUserInfo if event data already has information loaded.', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });

      const analytics = new Analytics({
        appVersion: '1.22.0.0',
        userEmail: 'janis@janis.im',
        userId: 'janis1234',
        client: 'janis',
        language: 'language',
        connection: 'wifi',
        deviceId: '12345',
      });

      expect(await analytics.initialize('1.22.0.0')).toStrictEqual({
        appVersion: '1.22.0.0',
        userEmail: 'janis@janis.im',
        userId: 'janis1234',
        client: 'janis',
        language: 'language',
        connection: 'wifi',
        deviceId: '12345',
      });
    });

    it('return formatted eventData when getUserInfo returns information', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });
      spyGetUniqueId.mockReturnValueOnce('12345');
      spyGetUserInfo.mockResolvedValueOnce(userInfoResponse);

      const analytics = new Analytics({appVersion: '1.22.0.0'});

      await analytics.initialize('1.22.0.0');

      expect(analytics.eventData).toStrictEqual({
        appVersion: '1.22.0.0',
        client: 'validtcode',
        language: 'en-US',
        userEmail: 'janis@janis.im',
        userId: '5fd7b2c8d71fb1e2743bb64e',
        connection: 'wifi',
        deviceId: '12345',
      });
    });

    it('return eventData with only appVersion when getUserInfo fails', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });

      spyGetUserInfo.mockRejectedValueOnce('getUserInfo failed');

      const analytics = new Analytics({appVersion: '1.22.0.0'});

      expect(await analytics.initialize('1.22.0.0')).toStrictEqual({
        appVersion: '1.22.0.0',
      });
    });
  });

  it('return formatted eventData with default data when getUserInfo returns empty information', async () => {
    spyGetNetworkState.mockResolvedValueOnce({
      networkType: 'wifi',
    });
    spyGetUniqueId.mockReturnValueOnce('12345');
    spyGetUserInfo.mockResolvedValueOnce({});

    const analytics = new Analytics({appVersion: '1.22.0.0'});

    expect(await analytics.initialize('1.22.0.0')).toStrictEqual({
      appVersion: '1.22.0.0',
      connection: 'wifi',
      deviceId: '12345',
    });
  });

  describe('sendUserInfo method', () => {
    it('send userInfo event to analytics when running in productive environments', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });
      spyGetUniqueId.mockReturnValueOnce('12345');
      spyGetUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetScreenMeasurements.mockReturnValueOnce({
        screenHeight: 100,
        screenWidth: 200,
      });

      const analytics = new Analytics({
        appVersion: '1.22.0.0',
        client: 'janis',
        userEmail: 'janis@janis.im',
        userId: '12345',
        language: 'EN-US',
        connection: 'wifi',
        deviceId: '12345',
        isDebugMode: true,
      });

      await analytics.sendUserInfo();

      expect(userInfoEvent).toBeCalled();
    });

    it('should not send the event in development environments', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });
      spyGetScreenMeasurements.mockReturnValueOnce({
        screenHeight: 100,
        screenWidth: 200,
      });

      const analytics = new Analytics({
        appVersion: '1.22.0.0',
        client: 'janis',
        userEmail: 'janis@janis.im',
        userId: '12345',
        language: 'EN-US',
        connection: 'wifi',
        deviceId: '12345',
      });

      await analytics.sendUserInfo();

      expect(userInfoEvent).not.toBeCalled();
    });

    it('return null when not receive required params', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });
      spyGetScreenMeasurements.mockReturnValueOnce({
        screenHeight: 100,
        screenWidth: 200,
      });

      const analytics = new Analytics();
      const response = await analytics.sendUserInfo();

      expect(userInfoEvent).not.toBeCalled();
      expect(response).toBe(null);
    });
  });

  describe('sendAction method', () => {
    it('should not send the event in development environments', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });

      const analytics = new Analytics({
        appVersion: '1.22.0.0',
        client: 'janis',
        userEmail: 'janis@janis.im',
        userId: '12345',
        language: 'EN-US',
        connection: 'wifi',
        deviceId: '12345',
      });

      await analytics.sendAction('on press button', []);

      expect(actionEvent).not.toBeCalled();
    });

    it('send actionEvent event to analytics when running in productive environments', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });
      spyGetUniqueId.mockReturnValueOnce('12345');
      spyGetUserInfo.mockResolvedValueOnce(userInfoResponse);

      const analytics = new Analytics({
        appVersion: '1.22.0.0',
        client: 'janis',
        userEmail: 'janis@janis.im',
        userId: '12345',
        language: 'EN-US',
        connection: 'wifi',
        deviceId: '12345',
        isDebugMode: true,
      });

      await analytics.sendAction('on press button', 'Home', {
        userRol: 'picker',
      });

      expect(actionEvent).toBeCalled();
    });

    it('send actionEvent event to analytics when in debug mode', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });
      spyGetUniqueId.mockReturnValueOnce('12345');
      spyGetUserInfo.mockResolvedValueOnce(userInfoResponse);

      const analytics = new Analytics({
        appVersion: '1.22.0.0',
        client: 'janis',
        userEmail: 'janis@janis.im',
        userId: '12345',
        language: 'EN-US',
        connection: 'wifi',
        deviceId: '12345',
        isDebugMode: true,
      });

      await analytics.sendAction('on press button', 'Home', {
        userRol: 'picker',
      });

      expect(actionEvent).toBeCalled();
    });

    it('return null when not receive required params', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });

      const analytics = new Analytics();
      const response = await analytics.sendAction();

      expect(actionEvent).not.toBeCalled();
      expect(response).toBeNull();
    });
  });

  describe('sendCustomEvent method', () => {
    it('send customEvent to analytics when running in productive environments', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });
      spyGetUniqueId.mockReturnValueOnce('12345');
      spyGetUserInfo.mockResolvedValueOnce(userInfoResponse);

      const analytics = new Analytics({
        appVersion: '1.22.0.0',
        client: 'janis',
        userEmail: 'janis@janis.im',
        userId: '12345',
        language: 'EN-US',
        connection: 'wifi',
        deviceId: '12345',
        isDebugMode: true,
      });

      await analytics.sendCustomEvent(
        'customTest',
        {
          rol: 'dev',
          location: 'palermo',
        },
        ['rol', 'location'],
      );

      expect(customEvent).toBeCalled();
    });

    it('should not send the event in development environments', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });

      const analytics = new Analytics({
        appVersion: '1.22.0.0',
        client: 'janis',
        userEmail: 'janis@janis.im',
        userId: '12345',
        language: 'EN-US',
        connection: 'wifi',
        deviceId: '12345',
      });

      await analytics.sendCustomEvent('customTest', 'testing value');

      expect(customEvent).not.toBeCalled();
    });

    it('return null when not receive required params', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });

      const analytics = new Analytics();
      const response = await analytics.sendCustomEvent();

      expect(customEvent).not.toBeCalled();
      expect(response).toBeNull();
    });
  });

  describe('sendScreenTracking method', () => {
    it('send screenViewEvent to analytics when running in productive environments', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });
      spyGetUniqueId.mockReturnValueOnce('12345');
      spyGetUserInfo.mockResolvedValueOnce(userInfoResponse);

      const analytics = new Analytics({
        appVersion: '1.22.0.0',
        client: 'janis',
        userEmail: 'janis@janis.im',
        userId: '12345',
        language: 'EN-US',
        connection: 'wifi',
        deviceId: '12345',
        isDebugMode: true,
      });

      await analytics.sendScreenTracking('Home', 'Home');

      expect(screenViewEvent).toBeCalled();
    });

    it('return null when not receive required params', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });
      spyGetUserInfo.mockResolvedValueOnce({});

      const analytics = new Analytics();
      const response = await analytics.sendScreenTracking();

      expect(screenViewEvent).not.toBeCalled();
      expect(response).toBeNull();
    });

    it('should not send the event in development environments', async () => {
      spyGetNetworkState.mockResolvedValueOnce({
        networkType: 'wifi',
      });

      const analytics = new Analytics({
        appVersion: '1.22.0.0',
        client: 'janis',
        userEmail: 'janis@janis.im',
        userId: '12345',
        language: 'EN-US',
        connection: 'wifi',
        deviceId: '12345',
      });

      await analytics.sendScreenTracking('Home', 'Home');

      expect(screenViewEvent).not.toBeCalled();
    });
  });
});
