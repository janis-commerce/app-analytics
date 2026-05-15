import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {validateData} from './utils';

const formatActionName = (name) =>
  name?.replace(/\s+/g, '_').toLowerCase() ?? null;

/**
 * @function actionEvent
 * @description Logs a Firebase 'action' event. actionName is formatted to lowercase with underscores.
 * @param {object} params data set to send
 * @param {string} params.actionName name of the action (e.g. 'button press' → 'button_press')
 * @param {string} params.screenName screen where the action was called
 * @param {string} params.appVersion app version in use
 * @param {string} params.deviceId device unique identifier
 * @param {string} params.connection current network type
 * @throws an error when params are missing or actionName is not provided
 */

const actionEvent = async (params) => {
  validateData(params, ['actionName']);

  await logEvent(getAnalytics(), 'action', {
    ...params,
    actionName: formatActionName(params.actionName),
  });
};

export default actionEvent;
