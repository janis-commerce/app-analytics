import analytics from '@react-native-firebase/analytics';
import {isDevEnv, formatValue, validateRequiredStringParams} from './utils';

/**
 * @function actionEvent
 * @description is responsible for registering an event that reports the execution of an action by the user. Not use the camelCase format, since the function transforms the strings to lowercase. Instead write with spaces, as they will later be replaced by underscores
 * @argument {object} params data set to send
 * @param {string} params.actionName name of the action that will be registered
 * @param {string} params.client janis operating client
 * @param {string} params.userEmail janis registered user email
 * @param {string} params.userId registered user id
 * @param {string} params.appVersion app version in use
 * @param {string} params.anotherKey... any extra data that you want to be sent will be cataloged as dataEvent
 * @throws an error when not pass valid params or any of the required parameters are missing
 * @returns {boolean}
 * @example
 * import {actionEvent} from '@janiscommerce/app-analytics'
 *
 * actionEvent({actionName:'button press',client: 'client',userEmail: 'janis@janis.im',userId:'123456',appVersion:'1.20.0'})
 */

const actionEvent = async (params) => {
  const requiredData = [
    'actionName',
    'client',
    'userEmail',
    'userId',
    'appVersion',
  ];

  try {
    if (!params || !Object.keys(params).length)
      throw new Error('Event data is required');

    await validateRequiredStringParams(params, requiredData);

    const eventData = {};

    requiredData.forEach((attribute) => {
      eventData[attribute] = formatValue(params[attribute]);

      delete params[attribute];
      return eventData;
    });

    await analytics().logEvent('action', {
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

export default actionEvent;
