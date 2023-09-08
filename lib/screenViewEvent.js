import analytics from '@react-native-firebase/analytics';
import {isDevEnv} from './utils';

/**
 * @function screenViewEvent
 * @description logs an event with information from the screen the user is viewing
 * @param {string} screenName Screen name the user is currently viewing.
 * @param {string} screenClass Current class associated with the view the user is currently viewing.
 * @throws an error when some required params is not passed
 * @returns {boolean}
 * @example
 * import {screenViewEvent} from '@janiscommerce/app-analytics'
 *
 * screenViewEvent('home','class_home'})
 */

const screenViewEvent = async (screenName, screenClass = '') => {
  try {
    if (!screenName) throw new Error('Screen name is required');

    if (typeof screenName !== 'string')
      throw new Error('Screen name is invalid, it should be a string');

    await analytics().logScreenView({
      screen_name: screenName,
      ...(screenClass &&
        typeof screenClass === 'string' && {screen_class: screenClass}),
    });

    return true;
  } catch (error) {
    if (isDevEnv()) {
      console.error(error.message);
    }

    return false;
  }
};

export default screenViewEvent;
