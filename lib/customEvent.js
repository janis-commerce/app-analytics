import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {validateData} from './utils';

/**
 * @function customEvent
 * @description Logs a custom Firebase event with the given params.
 * @param {string} eventName name of the event to register
 * @param {object} params event parameters sent as individual Firebase params
 * @throws an error when eventName is missing or params are invalid
 * @example
 * customEvent('order_created', { orderId: '123', status: 'pending' })
 */

const customEvent = async (eventName, params) => {
  if (!eventName || typeof eventName !== 'string')
    throw new Error('Event name is required');

  validateData(params);

  await logEvent(getAnalytics(), eventName, {...params});
};

export default customEvent;
