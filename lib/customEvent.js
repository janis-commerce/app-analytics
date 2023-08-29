import analytics from '@react-native-firebase/analytics';
import {isString, isObject} from '@janiscommerce/apps-helpers';
import {isDevEnv} from './utils';

/**
 * @function customEvent
 * @description allows to register a custom event, receives the name of the event to be registered and the associated data
 * @param {string} eventName name of the event that we are going to register
 * @param {object} dataEvent event parameters, information that we are going to send
 * @throws an error when some required params is not passed
 * @returns {boolean}
 * @example
 * import {logCustomEvent} from '@janiscommerce/app-analytics'
 *
 * logCustomEvent('event_init',{date:"2011-10-05T14:48:00.000Z"})
 */

const customEvent = async (eventName, dataEvent) => {
  try {
    if (!eventName || !isString(eventName))
      throw new Error('Event name is required');

    if (!dataEvent || !isObject(dataEvent))
      throw new Error('Event data is required');

    await analytics().logEvent(eventName, dataEvent);

    return true;
  } catch (error) {
    if (isDevEnv()) {
      console.log(error.message);
    }

    return false;
  }
};

export default customEvent;
