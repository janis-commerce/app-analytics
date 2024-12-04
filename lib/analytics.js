import {getUserInfo} from '@janiscommerce/oauth-native';
import {
  getDeviceModel,
  getOSVersion,
  getApplicationName,
  getDeviceScreenMeasurements,
  getUniqueId,
  getNetworkState,
} from '@janiscommerce/app-device-info';
import actionEvent from './actionEvent';
import customEvent from './customEvent';
import userInfoEvent from './userInfoEvent';
import screenViewEvent from './screenViewEvent';
import {
  formatBasicData,
  validObjectWithValues,
  promiseWrapper,
  includesAllProperties,
} from './utils';

/** *
 * @class Analytics
 * @name Analytics
 * @description This class is responsible for handling events to record user information, actions and custom events
 * @param {object} params an object that contains all the information regarding the user that you want to add as initial information. This will then be used based on the need of each event.
 * @param {string} params.appVersion a string that represents the version number of the app
 * @example
 * import Analytics from '@janiscommerce/app-analytics'
 *
 * const analytics = new Analytics({appVersion:'1.22.0'})
 */
class Analytics {
  eventData;

  constructor(params = {}) {
    this.eventData = validObjectWithValues(params);
    this.isDebugMode = params?.isDebugMode || false;
  }

  /** *
   * @module Analytics
   * @name initialize
   * @description This method is responsible for initializing the analytics class and obtaining the user information to build the instance;
   * @param {string} appVersion a string that represents the version number of the app
   * @example
   * const analyticsInstance = await Analytics.initialize('1.22.0.0')
   */

  async initialize(appVersion = '') {
    try {
      const {networkType} = await getNetworkState();

      this.eventData.connection = networkType;

      if (includesAllProperties(this.eventData)) return this.eventData;

      const [userInfo, userInfoError] = await promiseWrapper(getUserInfo());
      if (userInfoError) throw new Error(userInfoError.message);

      const {
        email: userEmail,
        sub: userId,
        tcode: client,
        locale: language,
      } = userInfo;

      this.eventData = {
        ...this.eventData,
        appVersion,
        deviceId: getUniqueId(),
        ...(!!userEmail && {userEmail}),
        ...(!!userId && {userId}),
        ...(!!client && {client}),
        ...(!!language && {language}),
      };

      return this.eventData;
    } catch (error) {
      if (this.isDebugMode) {
        console.error(error.message);
      }

      this.eventData = {appVersion};
      return this.eventData;
    }
  }

  /** *
   * @module Analytics
   * @name sendUserInfo
   * @description send userInfo Event to analytics console with user, app and device data.
   */

  /* eslint-disable consistent-return */

  async sendUserInfo() {
    const userInfo = await this.initialize(this.eventData?.appVersion);
    const {screenHeight, screenWidth} = getDeviceScreenMeasurements();

    if (!includesAllProperties(userInfo)) return null;

    const userInfoData = {
      ...formatBasicData(userInfo),
      appName: getApplicationName(),
      device: getDeviceModel(),
      osVersion: getOSVersion(),
      screenSize: {
        screenHeight,
        screenWidth,
      },
    };

    if (this.isDebugMode) {
      userInfoEvent(userInfoData, this.isDebugMode);
    }
  }

  /** *
   * @module Analytics
   * @name sendAction
   * @description send an action log to analytics console
   * @param {string} actionName is the name of the action the user completed
   * @param {string} screenName is the name of the screen where the action was called
   * @param {object} params An object with any additional information you would like to register for the event
   */
  async sendAction(actionName, screenName, params) {
    const userInfo = await this.initialize(this.eventData?.appVersion);
    const validParams = validObjectWithValues(params);

    if (!includesAllProperties(userInfo)) return null;

    const actionData = {
      screenName,
      ...validParams,
      ...formatBasicData(userInfo),
      actionName,
    };

    if (this.isDebugMode) {
      actionEvent(actionData, this.isDebugMode);
    }
  }

  /** *
   * @module Analytics
   * @name sendCustomEvent
   * @description send a new customEvent to analytics console
   * @param {string} eventName is the name that will be received the event logged
   * @param {object} params An object with any additional information you would like to register for the event
   * @param {array} requiredParams array of extra strings required for a custom event
   */
  async sendCustomEvent(customName, params, requiredParams) {
    const userInfo = await this.initialize(this.eventData?.appVersion);
    const validParams = validObjectWithValues(params);

    if (!includesAllProperties(userInfo)) return null;

    const customData = {
      ...validParams,
      ...formatBasicData(userInfo),
    };

    if (this.isDebugMode) {
      customEvent(customName, customData, requiredParams, this.isDebugMode);
    }
  }

  /** *
   * @module Analytics
   * @name sendScreenTracking
   * @description send a screenViewEvent to analytics console to record the screens the user visits
   * @param {string} screenName Screen name the user is currently viewing.
   * @param {string} screenClass Current class associated with the view the user is currently viewing.
   */

  async sendScreenTracking(screenName, screenClass) {
    const userInfo = await this.initialize(this.eventData?.appVersion);

    if (!includesAllProperties(userInfo)) return null;

    if (this.isDebugMode) {
      screenViewEvent(screenName, screenClass, userInfo, this.isDebugMode);
    }
  }
}

export default Analytics;
