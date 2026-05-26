import {
  getAnalytics,
  setUserId,
  setUserProperties,
} from '@react-native-firebase/analytics';
import {isObject, isEmptyObject} from '@janiscommerce/apps-helpers';
import {getUserInfo} from '@janiscommerce/oauth-native';
import {
  getDeviceModel,
  getOSVersion,
  getUniqueId,
  getNetworkState,
} from '@janiscommerce/app-device-info';
import actionEvent from './actionEvent';
import customEvent from './customEvent';
import screenViewEvent from './screenViewEvent';
import {isDevEnv, reportError, normalizeParams, validateData} from './utils';

/**
 * @class Analytics
 * @description Handles Firebase Analytics tracking for Janis apps. User identity is registered once per session via setSession/clearSession. Device and network data are attached to each event automatically.
 * @param {string} params.appVersion app version string (required)
 * @param {boolean} [params.isDebugMode=false] when true, events are sent even in dev environment
 * @example
 * const analytics = new Analytics({ appVersion: '1.0.0' })
 * await analytics.setSession()
 * await analytics.sendAction('button_press', 'home')
 */
class Analytics {
  /**
   * @param {object} params
   * @param {string} params.appVersion
   * @param {boolean} [params.isDebugMode=false]
   * @throws {Error} if appVersion is not provided
   */
  constructor({appVersion, isDebugMode = false} = {}) {
    if (!appVersion || typeof appVersion !== 'string')
      throw new Error('appVersion is required');

    this.session = {
      isReady: false,
      appVersion,
      isDebugMode,
      userProperties: {},
    };
  }

  /**
   * @name setSession
   * @description Fetches user info from OAuth token and registers identity in Firebase via setUserId and setUserProperties. Must be called once at login. Sets isReady to true on success.
   * @example
   * await analytics.setSession()
   */
  async setSession() {
    try {
      const userInfo = await getUserInfo();

      validateData(userInfo, ['sub', 'email', 'tcode']);

      const {
        email: userEmail,
        sub,
        tcode: client,
        locale: language,
        profileName: userProfile,
      } = userInfo;

      const userProperties = {
        userEmail,
        client,
        ...(!!language && {language}),
        ...(!!userProfile && {userProfile}),
      };

      await setUserId(getAnalytics(), sub);
      await setUserProperties(getAnalytics(), userProperties);

      this.session = {
        isReady: true,
        isDebugMode: this.session.isDebugMode,
        appVersion: this.session.appVersion,
        deviceId: getUniqueId(),
        device: getDeviceModel(),
        osVersion: getOSVersion(),
        userProperties: {
          ...this.session.userProperties,
          ...userProperties,
        },
      };
    } catch (error) {
      reportError(error);
    }
  }

  /**
   * @name setUserProperties
   * @description Updates one or more Firebase user properties. Use it to register or update dynamic user attributes after login (e.g. warehouseId, language).
   * @param {object} properties key/value pairs of user properties to set
   * @example
   * await analytics.setUserProperties({ warehouseId: 'WH-001' })
   */
  async setUserProperties(properties) {
    try {
      if (!isObject(properties) || isEmptyObject(properties))
        throw new Error('properties must be a non-empty object');

      await setUserProperties(getAnalytics(), properties);

      this.session.userProperties = {
        ...this.session.userProperties,
        ...properties,
      };
    } catch (error) {
      reportError(error);
    }
  }

  get #canSendEvent() {
    return this.session.isReady && (this.session.isDebugMode || !isDevEnv());
  }

  async #getBaseEventParams() {
    let connection = '';
    try {
      const {networkType} = await getNetworkState();
      connection = networkType;
    } catch (error) {
      reportError(error);
    }

    const {appVersion, deviceId, device, osVersion} = this.session;
    return {connection, appVersion, deviceId, device, osVersion};
  }

  /**
   * @name clearSession
   * @description Clears user identity from Firebase (setUserId null, setUserProperties null) and resets session state. Must be called at logout.
   * @example
   * await analytics.clearSession()
   */
  async clearSession() {
    try {
      const keysToClear = Object.keys(this.session.userProperties || {});
      const nullifiedProperties = keysToClear.reduce(
        (acc, key) => ({...acc, [key]: null}),
        {},
      );

      await setUserId(getAnalytics(), null);
      if (keysToClear.length) {
        await setUserProperties(getAnalytics(), nullifiedProperties);
      }

      this.session = {
        isReady: false,
        appVersion: this.session.appVersion,
        isDebugMode: this.session.isDebugMode,
        userProperties: {},
      };
    } catch (error) {
      reportError(error);
    }
  }

  /**
   * @name sendAction
   * @description Logs a Firebase 'action' event with the action name, screen name and optional extra params.
   * @param {string} actionName name of the action (formatted to lowercase with underscores)
   * @param {string} screenName screen where the action was triggered
   * @param {object} [params] optional extra params to include in the event
   * @returns {boolean|null} true on success, false on error, null if session not ready or dev env
   * @example
   * await analytics.sendAction('button_press', 'Home', { rol: 'picker' })
   */
  async sendAction(actionName, screenName, params) {
    try {
      if (!this.#canSendEvent) return null;
      const baseParams = await this.#getBaseEventParams();

      const validParams = normalizeParams(params);

      const actionData = {
        screenName,
        ...validParams,
        ...baseParams,
        actionName,
      };

      await actionEvent(actionData);
      return true;
    } catch (error) {
      reportError(error);
      return false;
    }
  }

  /**
   * @name sendCustomEvent
   * @description Logs a custom Firebase event with the given params.
   * @param {string} eventName name of the event to log
   * @param {object} [params] event params sent individually to Firebase
   * @returns {boolean|null} true on success, false on error, null if session not ready or dev env
   * @example
   * await analytics.sendCustomEvent('order_created', { orderId: '123' })
   */
  async sendCustomEvent(eventName, params) {
    try {
      if (!this.#canSendEvent) return null;
      const baseParams = await this.#getBaseEventParams();

      const validParams = normalizeParams(params);
      const customData = {...validParams, ...baseParams};

      await customEvent(eventName, customData);
      return true;
    } catch (error) {
      reportError(error);
      return false;
    }
  }

  /**
   * @name sendScreenTracking
   * @description Logs a Firebase screen view event with the current screen name and class.
   * @param {string} screenName name of the screen the user is viewing
   * @param {string} [screenClass] class associated with the screen
   * @returns {boolean|null} true on success, false on error, null if session not ready or dev env
   * @example
   * await analytics.sendScreenTracking('Home', 'HomeScreen')
   */
  async sendScreenTracking(screenName, screenClass) {
    try {
      if (!this.#canSendEvent) return null;
      const baseParams = await this.#getBaseEventParams();

      await screenViewEvent(screenName, screenClass, baseParams);
      return true;
    } catch (error) {
      reportError(error);
      return false;
    }
  }
}

export default Analytics;
