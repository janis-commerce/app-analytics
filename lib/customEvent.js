import analytics from '@react-native-firebase/analytics';
import {
  showErrorInDebug,
  validateRequiredStringParams,
  splitRequiredAndRemainingParams,
} from './utils';

/**
 * @function customEvent
 * @description allows to register a custom event, receives the name of the event to be registered and the associated data
 * @argument {string} eventName name of the event that we are going to register
 * @argument {object} params event parameters, information that we are going to send
 * @param {string} params.client janis operating client
 * @param {string} params.userEmail janis registered user email
 * @param {string} params.userId registered user id
 * @param {string} params.appVersion app version in use
 * @param {string} params.language user app language
 * @param {string} params.anotherKey... any extra data that you want to be sent will be cataloged as dataEvent
 * @param {boolean} isDebugMode a key that defines if the analytics mode is debug or not
 * @argument {string[]} customRequiredParams any extra parameters that may be required for any custom event
 * @throws an error when some required params is not passed
 * @returns {boolean}
 * @example
 * import {customEvent} from '@janiscommerce/app-analytics'
 *
 * customEvent('event_init',{date:"2011-10-05T14:48:00.000Z"})
 */

const customEvent = async (
  eventName,
  params,
  customRequiredParams = [],
  isDebugMode,
) => {
  try {
    const validParamsArray = Array.isArray(customRequiredParams)
      ? customRequiredParams
      : [];
    const filteredRequiredCustomParams = validParamsArray.filter(
      (value) => !!value && typeof value === 'string',
    );

    if (!eventName || typeof eventName !== 'string')
      throw new Error('Event name is required');

    if (!params || !Object.keys(params).length)
      throw new Error('Event data is required');

    validateRequiredStringParams(params, filteredRequiredCustomParams);

    const [requiredParams, remainingParams] = splitRequiredAndRemainingParams(
      params,
      filteredRequiredCustomParams,
    );

    await analytics().logEvent(eventName, {
      ...requiredParams,
      ...(remainingParams &&
        !!Object.keys(remainingParams).length && {
          dataEvent: JSON.stringify(remainingParams),
        }),
    });

    return true;
  } catch (error) {
    showErrorInDebug(error, isDebugMode);

    return false;
  }
};

export default customEvent;
