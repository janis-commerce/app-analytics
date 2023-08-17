import analytics from '@react-native-firebase/analytics';

/**
 * @name presetEvent
 * @returns all predefined analytics events
 * @description when executing this function we have access to all the predefined methods of google analytics
 * @example presetEvent().getAppInstanceId()
 * @example presetEvent().logTutorialBegin()
 * @example presetEvent().logTutorialComplete()
 */

const presetEvent = () => {

    return analytics()
}

export default presetEvent;