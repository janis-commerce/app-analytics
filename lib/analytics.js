import {getUserInfo} from '@janiscommerce/oauth-native';
import {
  getApplicationName,
  getSystemName,
  getSystemVersion,
  getModel,
  getBrand,
} from 'react-native-device-info';
import actionEvent from './actionEvent';
import customEvent from './customEvent';
import userInfoEvent from './userInfoEvent';
import screenViewEvent from './screenViewEvent';
import {
  isDevEnv,
  formatBasicData,
  validObjectWithValues,
  promiseWrapper,
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
  }

  /** *
   * @module Analytics
   * @name initialize
   * @description This method is responsible for initializing the analytics class and obtaining the user information to build the instance;
   * @param {string} appVersion a string that represents the version number of the app
   * @example
   * const analyticsInstance = await Analytics.initialize('1.22.0.0')
   */

  async initialize(versionApp = '') {
    try {
      // eslint-disable-next-line prefer-const
      let {appVersion = '', ...rest} = this.eventData;

      if (!!rest && !!Object.keys(rest).length) return this.eventData;

      appVersion = versionApp;
      const [userInfo, userInfoError] = await promiseWrapper(getUserInfo());

      if (userInfoError) throw new Error(userInfoError.message);

      const userData = {
        appVersion,
        userEmail: userInfo.email || '',
        userId: userInfo.sub || '',
        client: userInfo.tname || '',
        language: userInfo.locale || '',
      };

      this.eventData = userData;

      return this.eventData;
    } catch (error) {
      if (isDevEnv()) {
        console.error(error.message);
      }

      this.eventData = {appVersion: versionApp};
      return this.eventData;
    }
  }

  /** *
   * @module Analytics
   * @name sendUserInfo
   * @description send userInfo Event to analytics console with user, app and device data.
   */
  async sendUserInfo() {
    const userInfo = await this.initialize(this.eventData?.appVersion);

    const userInfoData = {
      ...formatBasicData(this.eventData),
      appName: getApplicationName(),
      device: `${getBrand()} ${getModel()}`,
      osVersion: `${getSystemName()} ${getSystemVersion()}`,
      language: userInfo?.language,
    };

    if (!isDevEnv()) {
      userInfoEvent(userInfoData);
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

    const actionData = {
      screenName,
      ...validParams,
      ...formatBasicData(userInfo),
      actionName,
    };

    if (!isDevEnv()) {
      actionEvent(actionData);
    }
  }

  /** *
   * @module Analytics
   * @name sendCustomEvent
   * @description send a new customEvent to analytics console
   * @param {string} eventName is the name that will be received the event logged
   * @param {object} params An object with any additional information you would like to register for the event
   */
  async sendCustomEvent(customName, params) {
    const userInfo = await this.initialize(this.eventData?.appVersion);
    const validParams = validObjectWithValues(params);

    const customData = {
      ...validParams,
      ...formatBasicData(userInfo),
    };

    if (!isDevEnv()) {
      customEvent(customName, customData);
    }
  }

  /** *
   * @module Analytics
   * @name sendScreenTracking
   * @description send a screenViewEvent to analytics console to record the screens the user visits
   * @param {string} screenName Screen name the user is currently viewing.
   * @param {string} screenClass Current class associated with the view the user is currently viewing.
   */

  static sendScreenTracking(screenName, screenClass) {
    if (!isDevEnv()) {
      screenViewEvent(screenName, screenClass);
    }
  }
}

export default Analytics;
