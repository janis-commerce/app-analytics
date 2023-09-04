import analytics from '@react-native-firebase/analytics';
import {isDevEnv} from './utils';

/**
 * @function userInfoEvent
 * @description is responsible for registering an event that reports all data of user, device and app
 * @param {object} params data set to send
 * @param {string} params.appName name of the app in use
 * @param {string} params.appVersion app version in use
 * @param {string} params.device device model
 * @param {string} params.os operative system
 * @param {string} params.osVersion version of the model
 * @param {string} params.userEmail janis registered user email
 * @param {string} params.userId registered user id
 * @param {string} params.client janis operating client
 * @param {string} params.language language used in the application
 * @throws an error when not pass valid params
 * @returns {boolean}
 * @example
 * import {userInfoEvent} from '@janiscommerce/app-analytics
 *
 * userInfoEvent({appName:'app_name',appVersion:'1.0.0',device:'samsung a10',os:'android',osVersion:'10',userEmail:'user_name@janis.im',userId:'012345678910', client: 'janis'})
 */

const userInfoEvent = async (params) => {
  try {
    if (!params || !Object.keys(params).length)
      throw new Error('Params are required');

    const {
      appName,
      appVersion,
      device,
      os,
      osVersion,
      userEmail,
      userId,
      language,
      client,
    } = params;

    const eventData = {
      ...(appName && typeof appName === 'string' && {appName}),
      ...(appVersion && typeof appVersion === 'string' && {appVersion}),
      ...(device && typeof device === 'string' && {device}),
      ...(os && typeof os === 'string' && {os}),
      ...(osVersion && typeof osVersion === 'string' && {osVersion}),
      ...(userEmail && typeof userEmail === 'string' && {userEmail}),
      ...(userId && typeof userId === 'string' && {userId}),
      ...(language && typeof language === 'string' && {language}),
      ...(client && typeof client === 'string' && {client}),
    };

    if (!Object.keys(eventData).length)
      throw new Error('Event data is required');

    await analytics().logEvent('user_info', eventData);

    return true;
  } catch (error) {
    if (isDevEnv()) {
      console.log(error.message);
    }

    return false;
  }
};

export default userInfoEvent;
