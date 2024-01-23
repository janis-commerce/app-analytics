import analytics from '@react-native-firebase/analytics';
import {
  isDevEnv,
  splitRequiredAndRemainingParams,
  validObjectWithValues,
  validateRequiredStringParams,
} from './utils';

/**
 * @function userInfoEvent
 * @description is responsible for registering an event that reports all data of user, device and app
 * @param {object} params data set to send
 * @param {string} params.appName name of the app in use
 * @param {string} params.appVersion app version in use
 * @param {string} params.device device model
 * @param {string} params.osVersion version of the model
 * @param {string} params.userEmail janis registered user email
 * @param {string} params.userId registered user id
 * @param {string} params.client janis operating client
 * @param {string} params.language language used in the application
 * @param {string} params.screenSize screen size to user'device
 * @param {string} params.screenSize.screenHeight user device screen height
 * @param {string} params.screenSize.screenWidth user device screen width
 * @throws an error when not pass valid params
 * @returns {boolean}
 * @example
 * import {userInfoEvent} from '@janiscommerce/app-analytics
 *
 * userInfoEvent({appName:'app_name',appVersion:'1.0.0',device:'samsung a10',os:'android',osVersion:'10',userEmail:'user_name@janis.im',userId:'012345678910', client: 'janis'})
 */

const userInfoEvent = async (params) => {
  const requiredData = [
    'appName',
    'appVersion',
    'device',
    'osVersion',
    'userEmail',
    'userId',
    'client',
  ];

  try {
    if (!params || !Object.keys(params).length)
      throw new Error('Params are required');

    const {screenSize, ...userData} = params;

    validateRequiredStringParams(userData, requiredData);

    const {screenWidth, screenHeight} = validObjectWithValues(screenSize);
    const [requiredParams, remainingParams] = splitRequiredAndRemainingParams(
      userData,
      requiredData,
    );

    await analytics().logEvent('user_info', {
      ...requiredParams,
      ...remainingParams,
      ...(!!screenWidth &&
        !!screenHeight && {screenSize: `${screenWidth} x ${screenHeight}`}),
    });

    return true;
  } catch (error) {
    if (isDevEnv()) {
      console.error(error.message);
    }

    return false;
  }
};

export default userInfoEvent;
