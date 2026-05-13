import analytics from '@react-native-firebase/analytics';
import {getUserInfo} from '@janiscommerce/oauth-native';
import * as deviceInfo from '@janiscommerce/app-device-info';
import Analytics from '../lib/index';
import actionEvent from '../lib/actionEvent';
import customEvent from '../lib/customEvent';
import screenViewEvent from '../lib/screenViewEvent';
import * as utils from '../lib/utils';

jest.mock('../lib/actionEvent');
jest.mock('../lib/customEvent');
jest.mock('../lib/screenViewEvent');

const firebaseInstance = analytics();

const userInfoResponse = {
  email: 'janis@janis.im',
  sub: '5fd7b2c8d71fb1e2743bb64e',
  tcode: 'validtcode',
  locale: 'en-US',
  profileName: 'Admin',
};

describe('Analytics class', () => {
  const mockedDevEnv = jest.spyOn(utils, 'isDevEnv');
  const spyGetNetworkState = jest.spyOn(deviceInfo, 'getNetworkState');
  const spyGetUniqueId = jest.spyOn(deviceInfo, 'getUniqueId');
  const spyGetApplicationName = jest.spyOn(deviceInfo, 'getApplicationName');
  const spyGetDeviceModel = jest.spyOn(deviceInfo, 'getDeviceModel');
  const spyGetOSVersion = jest.spyOn(deviceInfo, 'getOSVersion');

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('throws if appVersion is not provided', () => {
      expect(() => new Analytics({})).toThrow('appVersion is required');
    });

    it('throws if called with no arguments', () => {
      expect(() => new Analytics()).toThrow('appVersion is required');
    });

    it('initializes session with canTrackEvents false', () => {
      const instance = new Analytics({appVersion: '1.0.0'});
      expect(instance.session.canTrackEvents).toBe(false);
      expect(instance.session.appVersion).toBe('1.0.0');
    });

    it('initializes session with isDebugMode when provided', () => {
      const instance = new Analytics({appVersion: '1.0.0', isDebugMode: true});
      expect(instance.session.isDebugMode).toBe(true);
    });

    it('exposes sendAction as a function', () => {
      const instance = new Analytics({appVersion: '1.0.0'});
      expect(typeof instance.sendAction).toBe('function');
    });
  });

  describe('setSession', () => {
    it('calls setUserId with sub from token', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();

      expect(firebaseInstance.setUserId).toHaveBeenCalledWith(
        '5fd7b2c8d71fb1e2743bb64e',
      );
    });

    it('calls setUserProperties with mapped token fields', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();

      expect(firebaseInstance.setUserProperties).toHaveBeenCalledWith({
        userEmail: 'janis@janis.im',
        client: 'validtcode',
        language: 'en-US',
        profile: 'Admin',
      });
    });

    it('omits optional fields absent from token', async () => {
      getUserInfo.mockResolvedValueOnce({
        sub: '5fd7b2c8d71fb1e2743bb64e',
        email: 'janis@janis.im',
      });

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();

      expect(firebaseInstance.setUserProperties).toHaveBeenCalledWith({
        userEmail: 'janis@janis.im',
      });
    });

    it('sets canTrackEvents to true on success', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetApplicationName.mockReturnValueOnce('MyApp');
      spyGetDeviceModel.mockReturnValueOnce('Pixel 6');
      spyGetOSVersion.mockReturnValueOnce('13');

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();

      expect(instance.session.canTrackEvents).toBe(false);
    });

    it('stores device data and appVersion in session', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetApplicationName.mockReturnValueOnce('MyApp');
      spyGetDeviceModel.mockReturnValueOnce('Pixel 6');
      spyGetOSVersion.mockReturnValueOnce('13');

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();

      expect(instance.session).toMatchObject({
        canTrackEvents: true,
        appVersion: '1.0.0',
        deviceId: 'device-123',
        appName: 'MyApp',
        device: 'Pixel 6',
        osVersion: '13',
      });
    });

    it('keeps canTrackEvents false when getUserInfo fails', async () => {
      getUserInfo.mockRejectedValueOnce(new Error('auth error'));

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();

      expect(instance.session.canTrackEvents).toBe(false);
      expect(firebaseInstance.setUserId).not.toHaveBeenCalled();
      expect(firebaseInstance.setUserProperties).not.toHaveBeenCalled();
    });

    it('can be called multiple times without side effects', async () => {
      getUserInfo.mockResolvedValue(userInfoResponse);
      spyGetUniqueId.mockReturnValue('device-123');
      spyGetApplicationName.mockReturnValue('MyApp');
      spyGetDeviceModel.mockReturnValue('Pixel 6');
      spyGetOSVersion.mockReturnValue('13');

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      await instance.setSession();

      expect(firebaseInstance.setUserId).toHaveBeenCalledTimes(2);
      expect(instance.session.canTrackEvents).toBe(false);
    });
  });

  describe('clearSession', () => {
    it('calls setUserId with null', async () => {
      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.clearSession();

      expect(firebaseInstance.setUserId).toHaveBeenCalledWith(null);
    });

    it('calls setUserProperties with null values', async () => {
      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.clearSession();

      expect(firebaseInstance.setUserProperties).toHaveBeenCalledWith({
        userEmail: null,
        client: null,
        language: null,
        profile: null,
      });
    });

    it('resets session to canTrackEvents false', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetApplicationName.mockReturnValueOnce('MyApp');
      spyGetDeviceModel.mockReturnValueOnce('Pixel 6');
      spyGetOSVersion.mockReturnValueOnce('13');

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      await instance.clearSession();

      expect(instance.session.canTrackEvents).toBe(false);
    });

    it('handles error silently when firebase call fails', async () => {
      firebaseInstance.setUserId.mockRejectedValueOnce(
        new Error('firebase error'),
      );

      const instance = new Analytics({appVersion: '1.0.0'});
      await expect(instance.clearSession()).resolves.toBeUndefined();
    });
  });

  describe('#getBaseEventParams', () => {
    it('returns null and sets canTrackEvents false when getNetworkState fails', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockRejectedValueOnce(new Error('network error'));

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      const result = await instance.sendAction('press_button', 'Home');

      expect(result).toBeNull();
      expect(instance.session.canTrackEvents).toBe(false);
    });

    it('returns null and sets canTrackEvents false on sendCustomEvent when getNetworkState fails', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockRejectedValueOnce(new Error('network error'));

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      const result = await instance.sendCustomEvent('custom_event', {});

      expect(result).toBeNull();
      expect(instance.session.canTrackEvents).toBe(false);
    });

    it('returns null and sets canTrackEvents false on sendScreenTracking when getNetworkState fails', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockRejectedValueOnce(new Error('network error'));

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      const result = await instance.sendScreenTracking('Home', 'HomeClass');

      expect(result).toBeNull();
      expect(instance.session.canTrackEvents).toBe(false);
    });

    it('restores canTrackEvents to true when getNetworkState recovers', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValueOnce({networkType: 'wifi'});
      mockedDevEnv.mockReturnValueOnce(false);

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();

      await instance.sendAction('press_button', 'Home');
      expect(instance.session.canTrackEvents).toBe(false);

      await instance.sendAction('press_button', 'Home');
      expect(instance.session.canTrackEvents).toBe(true);
    });
  });

  describe('sendAction', () => {
    it('returns null when canTrackEvents is false', async () => {
      const instance = new Analytics({appVersion: '1.0.0'});
      const result = await instance.sendAction('press_button', 'Home');

      expect(result).toBeNull();
      expect(actionEvent).not.toHaveBeenCalled();
    });

    it('returns null in dev environment without debug mode', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      const result = await instance.sendAction('press_button', 'Home');

      expect(result).toBeNull();
      expect(actionEvent).not.toHaveBeenCalled();
    });

    it('calls actionEvent in production environment', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
      mockedDevEnv.mockReturnValueOnce(false);

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      await instance.sendAction('press_button', 'Home', {rol: 'picker'});

      expect(actionEvent).toHaveBeenCalled();
    });

    it('calls actionEvent in debug mode regardless of environment', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});

      const instance = new Analytics({appVersion: '1.0.0', isDebugMode: true});
      await instance.setSession();
      await instance.sendAction('press_button', 'Home');

      expect(actionEvent).toHaveBeenCalled();
    });

    it('does not include user identity fields in event params', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
      mockedDevEnv.mockReturnValueOnce(false);

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      await instance.sendAction('press_button', 'Home');

      const calledWith = actionEvent.mock.calls[0][0];
      expect(calledWith).not.toHaveProperty('userEmail');
      expect(calledWith).not.toHaveProperty('userId');
      expect(calledWith).not.toHaveProperty('client');
      expect(calledWith).not.toHaveProperty('language');
      expect(calledWith).not.toHaveProperty('userProfile');
    });
  });

  describe('sendCustomEvent', () => {
    it('returns null when canTrackEvents is false', async () => {
      const instance = new Analytics({appVersion: '1.0.0'});
      const result = await instance.sendCustomEvent('custom_event', {});

      expect(result).toBeNull();
      expect(customEvent).not.toHaveBeenCalled();
    });

    it('returns null in dev environment without debug mode', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      const result = await instance.sendCustomEvent('custom_event', {});

      expect(result).toBeNull();
      expect(customEvent).not.toHaveBeenCalled();
    });

    it('calls customEvent in production environment', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
      mockedDevEnv.mockReturnValueOnce(false);

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      await instance.sendCustomEvent('custom_event', {rol: 'dev'}, ['rol']);

      expect(customEvent).toHaveBeenCalled();
    });

    it('calls customEvent in debug mode regardless of environment', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});

      const instance = new Analytics({appVersion: '1.0.0', isDebugMode: true});
      await instance.setSession();
      await instance.sendCustomEvent('custom_event', {rol: 'dev'});

      expect(customEvent).toHaveBeenCalled();
    });

    it('does not include user identity fields in event params', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
      mockedDevEnv.mockReturnValueOnce(false);

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      await instance.sendCustomEvent('custom_event', {rol: 'dev'});

      const calledWith = customEvent.mock.calls[0][1];
      expect(calledWith).not.toHaveProperty('userEmail');
      expect(calledWith).not.toHaveProperty('userId');
      expect(calledWith).not.toHaveProperty('client');
      expect(calledWith).not.toHaveProperty('language');
      expect(calledWith).not.toHaveProperty('userProfile');
    });
  });

  describe('sendScreenTracking', () => {
    it('returns null when canTrackEvents is false', async () => {
      const instance = new Analytics({appVersion: '1.0.0'});
      const result = await instance.sendScreenTracking('Home', 'HomeClass');

      expect(result).toBeNull();
      expect(screenViewEvent).not.toHaveBeenCalled();
    });

    it('returns null in dev environment without debug mode', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      const result = await instance.sendScreenTracking('Home', 'HomeClass');

      expect(result).toBeNull();
      expect(screenViewEvent).not.toHaveBeenCalled();
    });

    it('calls screenViewEvent in production environment', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
      mockedDevEnv.mockReturnValueOnce(false);

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      await instance.sendScreenTracking('Home', 'HomeClass');

      expect(screenViewEvent).toHaveBeenCalled();
    });

    it('calls screenViewEvent in debug mode regardless of environment', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});

      const instance = new Analytics({appVersion: '1.0.0', isDebugMode: true});
      await instance.setSession();
      await instance.sendScreenTracking('Home', 'HomeClass');

      expect(screenViewEvent).toHaveBeenCalled();
    });

    it('does not include user identity fields in event params', async () => {
      getUserInfo.mockResolvedValueOnce(userInfoResponse);
      spyGetUniqueId.mockReturnValueOnce('device-123');
      spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
      mockedDevEnv.mockReturnValueOnce(false);

      const instance = new Analytics({appVersion: '1.0.0'});
      await instance.setSession();
      await instance.sendScreenTracking('Home', 'HomeClass');

      const calledWith = screenViewEvent.mock.calls[0][2];
      expect(calledWith).not.toHaveProperty('userEmail');
      expect(calledWith).not.toHaveProperty('userId');
      expect(calledWith).not.toHaveProperty('client');
      expect(calledWith).not.toHaveProperty('language');
      expect(calledWith).not.toHaveProperty('userProfile');
    });
  });
});
