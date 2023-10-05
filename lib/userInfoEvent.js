import analytics from '@react-native-firebase/analytics';
import {isDevEnv} from './utils';
import {boldRed, boldCian, boldGreen} from './utils/decorationText';

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

    if (os && isDevEnv()) {
      // eslint-disable-next-line no-console
      console.info(
        '\n\n\n',
        '\x1b[103m \x1b[1m\x1b[30m',
        'DEPRECATED PROP ALERT: ','\x1b[0m',
        '\n\nYou are implementing "os" as a property:\n',
        '\nuserInfoEvent({os:"android",osVersion:"12"}',
        boldRed, 'x',
        '\n\nFrom the next version the "os" prop will be deprecated.\n',
        boldCian,
        '\n','We recommend that you submit the O.System information as follows: \n',
        '\x1b[0m',
        '\nuserInfoEvent({osVersion:"android 12"}',
        boldGreen,
        '✓', '\n\nYou will need to change the implementation before the next package update!','\x1b[0m'
      );
    }

    const validOs = os && typeof os === 'string';

    const parsedOSVersion =
      validOs && !osVersion?.includes(os) ? `${os} ${osVersion}` : osVersion;

    const eventData = {
      ...(appName &&
        typeof appName === 'string' && {appName: appName.toLowerCase()}),
      ...(appVersion && typeof appVersion === 'string' && {appVersion}),
      ...(device &&
        typeof device === 'string' && {device: device.toLowerCase()}),
      ...(osVersion &&
        typeof osVersion === 'string' && {
          osVersion: parsedOSVersion.toLowerCase(),
        }),
      ...(userEmail &&
        typeof userEmail === 'string' && {userEmail: userEmail.toLowerCase()}),
      ...(userId &&
        typeof userId === 'string' && {userId: userId.toLowerCase()}),
      ...(language && typeof language === 'string' && {language}),
      ...(client &&
        typeof client === 'string' && {client: client.toLowerCase()}),
    };

    if (!Object.keys(eventData).length)
      throw new Error('Event data is required');

    await analytics().logEvent('user_info', eventData);

    return true;
  } catch (error) {
    if (isDevEnv()) {
      console.error(error.message);
    }

    return false;
  }
};

export default userInfoEvent;
