import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {validateData} from './utils';

/**
 * @function customEvent
 * @description Logs a custom Firebase event. Extra params are serialized under dataEvent to stay within Firebase's 25-param limit.
 * @param {string} eventName name of the event to register
 * @param {object} params main event parameters, sent as individual Firebase params
 * @param {object} extraParams additional data serialized as dataEvent (JSON string)
 * @throws an error when eventName is missing or params are invalid
 * @example
 * sendCustomEvent('order_created', { orderId: '123', status: 'pending' }, { note: 'fragile' })
 */

const customEvent = async (eventName, params, extraParams = {}) => {
  if (!eventName || typeof eventName !== 'string')
    throw new Error('Event name is required');

  validateData(params);

  await logEvent(getAnalytics(), eventName, {
    ...params,
    ...(!!Object.keys(extraParams).length && {
      dataEvent: JSON.stringify(extraParams),
    }),
  });
};

export default customEvent;
