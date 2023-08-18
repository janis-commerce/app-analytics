import analytics from '@react-native-firebase/analytics';

/**
 * @name recommendedEvents
 * @returns all predefined analytics events
 * @description when executing this function we have access to all the predefined methods of google analytics
 * @example recommendedEvents().getAppInstanceId()
 * @example recommendedEvents().logTutorialBegin()
 * @example recommendedEvents().logTutorialComplete()
 */

const recommendedEvents = () => {

    return analytics()
}

export default recommendedEvents;