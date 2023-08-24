import analytics from '@react-native-firebase/analytics';

/**
 * @function userInfoEvent
 * @description is responsible for registering an event that reports all data of user, device and app
 * @param {object} params
 * @param {string} params.appName
 * @param {string} params.appVersion app version in use
 * @param {string} params.device device model
 * @param {string} params.os operative system
 * @param {string} params.osVersion version of the model
 * @param {string} params.userName
 * @param {string} params.userId
 * @throws an error when not pass valid params
 * @returns {boolean}
 * @example
 * import {userInfoEvent} from '@janiscommerce/app-analytics
 * userInfoEvent({appName:'app_name',appVersion:'1.0.0',device:'samsung a10',os:'android',osVersion:'10',userName:'user_name',userId:'012345678910'})
 */

const userInfoEvent = async (params) => {
  try {
    if (!params || !Object.keys(params).length) throw new Error('Params are required');

    const {
      appName,
      appVersion,
      device,
      os,
      osVersion,
      userName,
      userId,
      language,
    } = params;

    const validAppName = appName && typeof appName === 'string';
    const validAppVersion = appVersion && typeof appVersion === 'string';
    const validDevice = device && typeof device === 'string';
    const validOS = os && typeof os === 'string';
    const validOSVersion = osVersion && typeof osVersion === 'string';
    const validOSinfo = validOS && validOSVersion
    const validUserName = userName && typeof userName === 'string';
    const validUserID = userId && typeof userId === 'string';
    const validLanguage = language && typeof language === 'string';

    const eventData = {
      ...(validAppName && {appName}),
      ...(validAppVersion && {appVersion}),
      ...(validDevice && {device}),
      ...(validOSinfo && {OS_info: `${os} ${osVersion}`}),
      ...(validUserName && {userName}),
      ...(validUserID && {userId}),
      ...(validLanguage && {language}),
    };

    if (!Object.keys(eventData).length)
      throw new Error('Event data is required');

    await analytics().logEvent('user_device_info', eventData);

    return true;
  } catch (error) {
    return error.message;
  }
};

export default userInfoEvent;
