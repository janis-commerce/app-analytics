import actionEvent from './actionEvent';
import customEvent from './customEvent';
import userInfoEvent from './userInfoEvent';
import screenViewEvent from './screenViewEvent';
import {isDevEnv, formatBasicData} from './utils';

/** *
 * @name Analytics
 * @description This class is responsible for handling events to record user information, actions and custom events
 * @param {object} params an object that contains all the information regarding the user that you want to add as initial information. This will then be used based on the need of each event.
 */
class Analytics {
  constructor(params = {}) {
    this.eventData =
      !Object.keys(params).length || typeof params !== 'object' ? {} : params;
  }

  /** *
   * @module Analytics
   * @name sendUserInfo
   * @description send userInfo Event to analytics console with user, app and device data.
   */
  async sendUserInfo() {
    const {
      language = '',
      appName = '',
      device = '',
      osVersion = '',
    } = this.eventData;

    const userInfoData = {
      ...formatBasicData(this.eventData),
      appName,
      language,
      device,
      osVersion,
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
   * @param {object} params An object with any additional information you would like to register for the event
   */
  async sendAction(actionName, params) {
    const validParams =
      typeof params === 'object' && !!Object.keys(params).length ? params : {};

    const {screenName = ''} = this.eventData;

    const actionData = {
      screenName,
      ...validParams,
      ...formatBasicData(this.eventData),
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
    const validParams =
      typeof params === 'object' && !!Object.keys(params).length ? params : {};

    const customData = {
      ...validParams,
      ...formatBasicData(this.eventData),
    };

    if (!isDevEnv()) {
      customEvent(customName, customData);
    }
  }

  /** *
   * @module Analytics
   * @name sendScreenTracking
   * @description send a screenViewEvent to analytics console
   * @param {string} screenName Screen name the user is currently viewing.
   * @param {string} screenClass Current class associated with the view the user is currently viewing.
   */

  static async sendScreenTracking(screenName, screenClass) {
    if (!isDevEnv()) {
      screenViewEvent(screenName, screenClass);
    }
  }
}

export default Analytics;
