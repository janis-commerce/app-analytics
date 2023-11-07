import analytics from '@react-native-firebase/analytics';
import {
  showErrorInDebug,
  formatValue,
  validateRequiredStringParams,
  splitRequiredAndRemainingParams,
} from './utils';

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

    validateRequiredStringParams(params, requiredData);

    const [requiredParams, remainingParams] = splitRequiredAndRemainingParams(
      params,
      requiredData,
      formatValue,
    );

    await analytics().logEvent('action', {
      ...requiredParams,
      ...(remainingParams &&
        !!Object.keys(remainingParams).length && {
          dataEvent: JSON.stringify(remainingParams),
        }),
    });

    return true;
  } catch (error) {
    showErrorInDebug(error);

    return false;
  }
};

export default actionEvent;
