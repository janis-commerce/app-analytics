import analytics from '@react-native-firebase/analytics'
import {isObject,isString} from '@janiscommerce/apps-helpers'

/**
 * @name sendUserInfo
 * @description is responsible for registering an event that reports all data of user, device and app 
 * @param {object} params 
 * @param {string} params.appName 
 * @param {string} params.appVersion app version in use
 * @param {string} params.device device model
 * @param {string} params.os operative system
 * @param {string} params.osVersion version of the model
 * @param {string} params.userName 
 * @param {string} params.userId
 * @throws an error when not pass appName or appVersion
 * @example sendUserInfo({appName:'app_name',appVersion:'1.0.0',device:'samsung a10',os:'android',osVersion:'10',userName:'user_name',userId:'012345678910'})
 */

const sendUserInfo = async (params) => {

    if(!params || !isObject(params)) 
        throw new Error('Params are required')
    
    const {appName,appVersion,device,os,osVersion,userName,userId, ...props} = params;

    const validAppName = appName && isString(appName);
    const validAppVersion = appVersion && isString(appVersion);
    const validDevice = device && isString(device);
    const validOS = os && isString(os);
    const validOSVersion = osVersion && isString(osVersion);
    const validOSinfo = validOS && validOSVersion
    const validUserName = userName && isString(userName);
    const validUserID = userId && isString(userId);

    if(!validAppName) throw new Error('App name is required');
    if(!validAppVersion) throw new Error('App version is required');

    const eventData = {
        appName,
        appVersion,
        ...(validDevice && {device}),
        ...(validOSinfo && {OS_info: `${os} ${osVersion}`}),
        ...(validUserName && {userName}),
        ...(validUserID && {userId}),
        ...props
    };

    await analytics().logEvent('user_device_info',eventData)
};

export default sendUserInfo;