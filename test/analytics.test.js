import analytics from '@react-native-firebase/analytics';
import {getUserInfo} from '@janiscommerce/oauth-native';
import * as deviceInfo from '@janiscommerce/app-device-info';
import Analytics from '../lib/index';
import * as utils from '../lib/utils';

const firebaseInstance = analytics();

const userInfoResponse = {
  email: 'janis@janis.im',
  sub: 'sub-identifier-user-123',
  tcode: 'validtcode',
  locale: 'en-US',
  profileName: 'Admin',
};

describe('Analytics class', () => {
  const mockedDevEnv = jest.spyOn(utils, 'isDevEnv');
  const spyGetNetworkState = jest.spyOn(deviceInfo, 'getNetworkState');
  const spyGetUniqueId = jest.spyOn(deviceInfo, 'getUniqueId');
  const spyGetDeviceModel = jest.spyOn(deviceInfo, 'getDeviceModel');
  const spyGetOSVersion = jest.spyOn(deviceInfo, 'getOSVersion');

  afterEach(() => {
    jest.clearAllMocks();
    spyGetNetworkState.mockReset();
  });

  describe('constructor', () => {
    describe('throws an error when', () => {
      it('throws when called with no arguments', () => {
        expect(() => new Analytics()).toThrow('appVersion is required');
      });

      it.each([[undefined], [null], [''], [123], [{}]])(
        'appVersion is %p',
        (params) => {
          expect(() => new Analytics({appVersion: params})).toThrow(
            'appVersion is required',
          );
        },
      );
    });

    it('initializes session with isReady false', () => {
      const instance = new Analytics({appVersion: '1.0.0'});
      expect(instance.session.isReady).toBe(false);
      expect(instance.session.appVersion).toBe('1.0.0');
    });

    it('initializes session with isDebugMode when provided', () => {
      const instance = new Analytics({appVersion: '1.0.0', isDebugMode: true});
      expect(instance.session.isDebugMode).toBe(true);
    });
  });

  describe('methods', () => {
    describe('setSession', () => {
      it('calls setUserId with sub from token', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();

        expect(firebaseInstance.setUserId).toHaveBeenCalledWith(
          'sub-identifier-user-123',
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
          userProfile: 'Admin',
        });
      });

      it('sets isReady to true on success', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetDeviceModel.mockReturnValueOnce('Pixel 6');
        spyGetOSVersion.mockReturnValueOnce('13');

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();

        expect(instance.session.isReady).toBe(true);
      });

      it('stores device data and appVersion in session', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetDeviceModel.mockReturnValueOnce('Pixel 6');
        spyGetOSVersion.mockReturnValueOnce('13');

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();

        expect(instance.session).toMatchObject({
          isReady: true,
          appVersion: '1.0.0',
          deviceId: 'device-123',
          device: 'Pixel 6',
          osVersion: '13',
        });
      });

      it('stores registered user properties in session', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();

        expect(instance.session.userProperties).toEqual({
          userEmail: 'janis@janis.im',
          client: 'validtcode',
          language: 'en-US',
          userProfile: 'Admin',
        });
      });

      describe('keeps isReady false when', () => {
        it('getUserInfo fails', async () => {
          getUserInfo.mockRejectedValueOnce(new Error('auth error'));

          const instance = new Analytics({appVersion: '1.0.0'});
          await instance.setSession();

          expect(instance.session.isReady).toBe(false);
          expect(firebaseInstance.setUserId).not.toHaveBeenCalled();
          expect(firebaseInstance.setUserProperties).not.toHaveBeenCalled();
        });

        it('token is missing required fields', async () => {
          getUserInfo.mockResolvedValueOnce({
            sub: 'sub-identifier-user-123',
            email: 'janis@janis.im',
          });

          const instance = new Analytics({appVersion: '1.0.0'});
          await instance.setSession();

          expect(instance.session.isReady).toBe(false);
          expect(firebaseInstance.setUserId).not.toHaveBeenCalled();
          expect(firebaseInstance.setUserProperties).not.toHaveBeenCalled();
        });
      });
    });

    describe('clearSession', () => {
      it('calls setUserId with null to clear identity', async () => {
        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.clearSession();

        expect(firebaseInstance.setUserId).toHaveBeenCalledWith(null);
      });

      it('nullifies all registered user properties after setSession', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        await instance.clearSession();

        expect(firebaseInstance.setUserProperties).toHaveBeenLastCalledWith({
          userEmail: null,
          client: null,
          language: null,
          userProfile: null,
        });
      });

      it('nullifies dynamic properties added via setUserProperties', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        await instance.setUserProperties({warehouseId: 'WH-001'});
        await instance.clearSession();

        expect(firebaseInstance.setUserProperties).toHaveBeenLastCalledWith(
          expect.objectContaining({warehouseId: null}),
        );
      });

      it('does not call setUserProperties when there are no properties to clear', async () => {
        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.clearSession();

        expect(firebaseInstance.setUserId).toHaveBeenCalledWith(null);
        expect(firebaseInstance.setUserProperties).not.toHaveBeenCalled();
      });

      it('preserves appVersion and isDebugMode after clearSession', async () => {
        const instance = new Analytics({
          appVersion: '2.5.0',
          isDebugMode: true,
        });
        await instance.clearSession();

        expect(instance.session.appVersion).toBe('2.5.0');
        expect(instance.session.isDebugMode).toBe(true);
        expect(instance.session.userProperties).toEqual({});
      });

      it('resets session to isReady false', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetDeviceModel.mockReturnValueOnce('Pixel 6');
        spyGetOSVersion.mockReturnValueOnce('13');

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        await instance.clearSession();

        expect(instance.session.isReady).toBe(false);
      });

      it('handles error silently when firebase call fails', async () => {
        firebaseInstance.setUserId.mockRejectedValueOnce(
          new Error('firebase error'),
        );

        const instance = new Analytics({appVersion: '1.0.0'});
        await expect(instance.clearSession()).resolves.toBeUndefined();
      });
    });

    describe('setUserProperties', () => {
      it('calls setUserProperties with the given properties', async () => {
        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setUserProperties({
          warehouseId: 'WH-001',
          language: 'es-AR',
        });

        expect(firebaseInstance.setUserProperties).toHaveBeenCalledWith({
          warehouseId: 'WH-001',
          language: 'es-AR',
        });
      });

      it('handles error silently when firebase call fails', async () => {
        firebaseInstance.setUserProperties.mockRejectedValueOnce(
          new Error('firebase error'),
        );

        const instance = new Analytics({appVersion: '1.0.0'});
        await expect(
          instance.setUserProperties({warehouseId: 'WH-001'}),
        ).resolves.toBeUndefined();
      });

      it.each([[undefined], [null], [{}], ['string'], [123]])(
        'handles error silently when properties is %p',
        async (properties) => {
          const instance = new Analytics({appVersion: '1.0.0'});
          await expect(
            instance.setUserProperties(properties),
          ).resolves.toBeUndefined();
          expect(firebaseInstance.setUserProperties).not.toHaveBeenCalled();
        },
      );

      it('accumulates dynamic properties in session.userProperties', async () => {
        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setUserProperties({warehouseId: 'WH-001'});
        await instance.setUserProperties({zone: 'north'});

        expect(instance.session.userProperties).toEqual({
          warehouseId: 'WH-001',
          zone: 'north',
        });
      });
    });

    describe('sendAction', () => {
      it('returns null when session is not ready', async () => {
        const instance = new Analytics({appVersion: '1.0.0'});
        const result = await instance.sendAction('press_button', 'Home');

        expect(result).toBeNull();
        expect(firebaseInstance.logEvent).not.toHaveBeenCalled();
      });

      it('sends event with empty connection when getNetworkState fails', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockRejectedValueOnce(new Error('network error'));

        const instance = new Analytics({
          appVersion: '1.0.0',
          isDebugMode: true,
        });
        await instance.setSession();
        const result = await instance.sendAction('press_button', 'Home');

        expect(result).toBe(true);
        expect(firebaseInstance.logEvent).toHaveBeenCalledWith(
          'action',
          expect.objectContaining({connection: ''}),
        );
      });

      it('returns null in dev environment without debug mode', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        const result = await instance.sendAction('press_button', 'Home');

        expect(result).toBeNull();
        expect(firebaseInstance.logEvent).not.toHaveBeenCalled();
      });

      it('calls logEvent in production environment', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
        mockedDevEnv.mockReturnValueOnce(false);

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        const result = await instance.sendAction('press_button', 'Home', {
          rol: 'picker',
        });

        expect(result).toBe(true);
        expect(firebaseInstance.logEvent).toHaveBeenCalledWith(
          'action',
          expect.objectContaining({
            actionName: 'press_button',
            screenName: 'Home',
            rol: 'picker',
          }),
        );
      });

      it('calls logEvent in debug mode regardless of environment', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});

        const instance = new Analytics({
          appVersion: '1.0.0',
          isDebugMode: true,
        });
        await instance.setSession();
        await instance.sendAction('press_button', 'Home');

        expect(firebaseInstance.logEvent).toHaveBeenCalled();
      });

      it('does not include user identity fields in event params', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
        mockedDevEnv.mockReturnValueOnce(false);

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        await instance.sendAction('press_button', 'Home');

        const calledWith = firebaseInstance.logEvent.mock.calls[0][1];
        expect(calledWith).not.toHaveProperty('userEmail');
        expect(calledWith).not.toHaveProperty('userId');
        expect(calledWith).not.toHaveProperty('client');
        expect(calledWith).not.toHaveProperty('language');
        expect(calledWith).not.toHaveProperty('userProfile');
      });

      it('returns false when logEvent throws', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
        mockedDevEnv.mockReturnValueOnce(false);
        firebaseInstance.logEvent.mockRejectedValueOnce(
          new Error('firebase error'),
        );

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        const result = await instance.sendAction('press_button', 'Home');

        expect(result).toBe(false);
      });

      it('reports error to crashlytics in prod when logEvent throws', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
        mockedDevEnv.mockReturnValueOnce(false);
        const spyReportError = jest
          .spyOn(utils, 'reportError')
          .mockImplementation(() => null);
        firebaseInstance.logEvent.mockRejectedValueOnce(
          new Error('firebase error'),
        );

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        await instance.sendAction('press_button', 'Home');

        expect(spyReportError).toHaveBeenCalledWith(expect.any(Error));
        spyReportError.mockRestore();
      });
    });

    describe('sendCustomEvent', () => {
      it('returns null when session is not ready', async () => {
        const instance = new Analytics({appVersion: '1.0.0'});
        const result = await instance.sendCustomEvent('custom_event');

        expect(result).toBeNull();
        expect(firebaseInstance.logEvent).not.toHaveBeenCalled();
      });

      it('sends event with empty connection when getNetworkState fails', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockRejectedValueOnce(new Error('network error'));

        const instance = new Analytics({
          appVersion: '1.0.0',
          isDebugMode: true,
        });
        await instance.setSession();
        const result = await instance.sendCustomEvent('custom_event');

        expect(result).toBe(true);
        expect(firebaseInstance.logEvent).toHaveBeenCalledWith(
          'custom_event',
          expect.objectContaining({connection: ''}),
        );
      });

      it('returns null in dev environment without debug mode', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        const result = await instance.sendCustomEvent('custom_event');

        expect(result).toBeNull();
        expect(firebaseInstance.logEvent).not.toHaveBeenCalled();
      });

      it('calls logEvent in production environment', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
        mockedDevEnv.mockReturnValueOnce(false);

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        const result = await instance.sendCustomEvent('order_created', {
          orderId: '123',
        });

        expect(result).toBe(true);
        expect(firebaseInstance.logEvent).toHaveBeenCalledWith(
          'order_created',
          expect.objectContaining({orderId: '123'}),
        );
      });

      it('calls logEvent in debug mode regardless of environment', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});

        const instance = new Analytics({
          appVersion: '1.0.0',
          isDebugMode: true,
        });
        await instance.setSession();
        await instance.sendCustomEvent('custom_event', {rol: 'dev'});

        expect(firebaseInstance.logEvent).toHaveBeenCalled();
      });

      it('does not include user identity fields in event params', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
        mockedDevEnv.mockReturnValueOnce(false);

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        await instance.sendCustomEvent('custom_event', {rol: 'dev'});

        const calledWith = firebaseInstance.logEvent.mock.calls[0][1];
        expect(calledWith).not.toHaveProperty('userEmail');
        expect(calledWith).not.toHaveProperty('userId');
        expect(calledWith).not.toHaveProperty('client');
        expect(calledWith).not.toHaveProperty('language');
        expect(calledWith).not.toHaveProperty('userProfile');
      });

      it('returns false when logEvent throws', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
        mockedDevEnv.mockReturnValueOnce(false);
        firebaseInstance.logEvent.mockRejectedValueOnce(
          new Error('firebase error'),
        );

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        const result = await instance.sendCustomEvent('order_created');

        expect(result).toBe(false);
      });
    });

    describe('sendScreenTracking', () => {
      it('returns null when session is not ready', async () => {
        const instance = new Analytics({appVersion: '1.0.0'});
        const result = await instance.sendScreenTracking('Home', 'HomeClass');

        expect(result).toBeNull();
        expect(firebaseInstance.logScreenView).not.toHaveBeenCalled();
      });

      it('sends event with empty connection when getNetworkState fails', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockRejectedValueOnce(new Error('network error'));

        const instance = new Analytics({
          appVersion: '1.0.0',
          isDebugMode: true,
        });
        await instance.setSession();
        const result = await instance.sendScreenTracking('Home', 'HomeClass');

        expect(result).toBe(true);
        expect(firebaseInstance.logScreenView).toHaveBeenCalledWith(
          expect.objectContaining({connection: ''}),
        );
      });

      it('returns null in dev environment without debug mode', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        const result = await instance.sendScreenTracking('Home', 'HomeClass');

        expect(result).toBeNull();
        expect(firebaseInstance.logScreenView).not.toHaveBeenCalled();
      });

      it('calls logScreenView in production environment', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
        mockedDevEnv.mockReturnValueOnce(false);

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        const result = await instance.sendScreenTracking('Home', 'HomeClass');

        expect(result).toBe(true);
        expect(firebaseInstance.logScreenView).toHaveBeenCalledWith(
          expect.objectContaining({
            screen_name: 'Home',
            screen_class: 'HomeClass',
          }),
        );
      });

      it('calls logScreenView in debug mode regardless of environment', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});

        const instance = new Analytics({
          appVersion: '1.0.0',
          isDebugMode: true,
        });
        await instance.setSession();
        await instance.sendScreenTracking('Home', 'HomeClass');

        expect(firebaseInstance.logScreenView).toHaveBeenCalled();
      });

      it('does not include user identity fields in event params', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
        mockedDevEnv.mockReturnValueOnce(false);

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        await instance.sendScreenTracking('Home', 'HomeClass');

        const calledWith = firebaseInstance.logScreenView.mock.calls[0][0];
        expect(calledWith).not.toHaveProperty('userEmail');
        expect(calledWith).not.toHaveProperty('userId');
        expect(calledWith).not.toHaveProperty('client');
        expect(calledWith).not.toHaveProperty('language');
        expect(calledWith).not.toHaveProperty('userProfile');
      });

      it('returns false when logScreenView throws', async () => {
        getUserInfo.mockResolvedValueOnce(userInfoResponse);
        spyGetUniqueId.mockReturnValueOnce('device-123');
        spyGetNetworkState.mockResolvedValueOnce({networkType: 'wifi'});
        mockedDevEnv.mockReturnValueOnce(false);
        firebaseInstance.logScreenView.mockRejectedValueOnce(
          new Error('firebase error'),
        );

        const instance = new Analytics({appVersion: '1.0.0'});
        await instance.setSession();
        const result = await instance.sendScreenTracking('Home', 'HomeClass');

        expect(result).toBe(false);
      });
    });
  });
});
