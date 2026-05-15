import {getAnalytics, logScreenView} from '@react-native-firebase/analytics';

/**
 * @function screenViewEvent
 * @description Logs a Firebase screen view event with the current screen name and class.
 * @param {string} screenName Screen name the user is currently viewing.
 * @param {string} screenClass Current class associated with the view the user is currently viewing.
 * @param {object} params base event params (appVersion, deviceId, connection, etc.)
 * @throws an error when screenName is missing or not a string
 */

const screenViewEvent = async (screenName, screenClass = '', params) => {
  if (!screenName || typeof screenName !== 'string')
    throw new Error('Screen name is required');

  await logScreenView(getAnalytics(), {
    screen_name: screenName,
    ...(screenClass &&
      typeof screenClass === 'string' && {screen_class: screenClass}),
    ...params,
  });
};

export default screenViewEvent;
