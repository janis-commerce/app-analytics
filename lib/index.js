import analytics from '@react-native-firebase/analytics';
import {promiseWrapper} from '@janiscommerce/apps-helpers';
import {getUserInfo} from '@janiscommerce/oauth-native';
import {
  getDeviceModel,
  getOSVersion,
  getApplicationName,
  getUniqueId,
  getNetworkState,
} from '@janiscommerce/app-device-info';
import actionEvent from './actionEvent';
import customEvent from './customEvent';
import screenViewEvent from './screenViewEvent';
import {
  isDevEnv,
  showErrorInDebug,
  normalizeParams,
  validateData,
} from './utils';

class Analytics {
  constructor({appVersion, isDebugMode = false} = {}) {
    if (!appVersion) throw new Error('appVersion is required');

    this.session = {
      isReady: false,
      canTrackEvents: false,
      appVersion,
      isDebugMode,
    };
  }

  async setSession() {
    try {
      const [userInfo, userInfoError] = await promiseWrapper(getUserInfo());
      if (userInfoError) throw new Error(userInfoError.message);

      validateData(userInfo, [
        'sub',
        'email',
        'tcode',
        'locale',
        'profileName',
      ]);

      const {
        email: userEmail,
        sub,
        tcode: client,
        locale: language,
        profileName: profile,
      } = userInfo;

      await analytics().setUserId(sub);
      await analytics().setUserProperties({
        ...(!!userEmail && {userEmail}),
        ...(!!client && {client}),
        ...(!!language && {language}),
        ...(!!profile && {profile}),
      });

      this.session = {
        isReady: true,
        canTrackEvents: true,
        isDebugMode: this.session.isDebugMode,
        appVersion: this.session.appVersion,
        deviceId: getUniqueId(),
        appName: getApplicationName(),
        device: getDeviceModel(),
        osVersion: getOSVersion(),
      };
    } catch (error) {
      showErrorInDebug(error);
    }
  }

  get #canSendEvent() {
    return this.session.isReady && this.session.canTrackEvents;
  }

  async #getBaseEventParams() {
    try {
      if (!this.session.isReady) throw new Error('Session is not ready');

      const {networkType: connection} = await getNetworkState();
      const {appVersion, deviceId, appName, device, osVersion} = this.session;

      this.session.canTrackEvents = true;

      return {connection, appVersion, deviceId, appName, device, osVersion};
    } catch (error) {
      showErrorInDebug(error);
      this.session.canTrackEvents = false;
      return null;
    }
  }

  async clearSession() {
    try {
      await analytics().setUserId(null);
      await analytics().setUserProperties({
        userEmail: null,
        client: null,
        language: null,
        profile: null,
      });

      this.session = {isReady: false, canTrackEvents: false};
    } catch (error) {
      showErrorInDebug(error);
    }
  }

  async sendAction(actionName, screenName, params) {
    try {
      const baseParams = await this.#getBaseEventParams();
      if (!this.#canSendEvent) return null;

      const validParams = normalizeParams(params);

      const actionData = {
        screenName,
        ...validParams,
        ...baseParams,
        actionName,
      };

      if (!this.session.isDebugMode && isDevEnv()) return null;

      await actionEvent(actionData);
      return true;
    } catch (error) {
      showErrorInDebug(error);
      return false;
    }
  }

  async sendCustomEvent({eventName, params, extraParams} = {}) {
    try {
      const baseParams = await this.#getBaseEventParams();
      if (!this.#canSendEvent) return null;

      const validParams = normalizeParams(params);

      const customData = {
        ...validParams,
        ...baseParams,
      };

      if (!this.session.isDebugMode && isDevEnv()) return null;

      await customEvent(eventName, customData, extraParams);
      return true;
    } catch (error) {
      showErrorInDebug(error);
      return false;
    }
  }

  async sendScreenTracking(screenName, screenClass) {
    try {
      const baseParams = await this.#getBaseEventParams();
      if (!this.#canSendEvent) return null;

      if (!this.session.isDebugMode && isDevEnv()) return null;

      await screenViewEvent(screenName, screenClass, baseParams);
      return true;
    } catch (error) {
      showErrorInDebug(error);
      return false;
    }
  }
}

export default Analytics;
