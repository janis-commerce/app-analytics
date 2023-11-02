import analytics from '@react-native-firebase/analytics';
import {isDevEnv, validateRequiredStringParams} from './utils';

/**
 * @function customEvent
 * @description allows to register a custom event, receives the name of the event to be registered and the associated data
 * @argument {string} eventName name of the event that we are going to register
 * @argument {object} params event parameters, information that we are going to send
 * @param {string} params.client janis operating client
 * @param {string} params.userEmail janis registered user email
 * @param {string} params.userId registered user id
 * @param {string} params.appVersion app version in use
 * @param {string} params.anotherKey... any extra data that you want to be sent will be cataloged as dataEvent
 * @throws an error when some required params is not passed
 * @returns {boolean}
 * @example
 * import {customEvent} from '@janiscommerce/app-analytics'
 *
 * customEvent('event_init',{date:"2011-10-05T14:48:00.000Z"})
 */

const customEvent = async (eventName, params) => {
  const requiredData = ['userEmail', 'userId', 'client', 'appVersion'];

  try {
    if (!eventName || typeof eventName !== 'string')
      throw new Error('Event name is required');

    if (!params || !Object.keys(params).length)
      throw new Error('Event data is required');

    await validateRequiredStringParams(params, requiredData);
    const eventData = {};

    requiredData.forEach((attribute) => {
      eventData[attribute] = params[attribute].toLowerCase();

      delete params[attribute];
      return eventData;
    });

    await analytics().logEvent(eventName, {
      ...eventData,
      ...(params &&
        !!Object.keys(params).length && {dataEvent: JSON.stringify(params)}),
    });

    return true;
  } catch (error) {
    if (isDevEnv()) {
      console.error(error.message);
    }

    return false;
  }
};

export default customEvent;
