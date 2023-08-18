import analytics from '@react-native-firebase/analytics';
import {isString} from '@janiscommerce/apps-helpers'

/**
 * @name logCustomEvent
 * @description allows to register a custom event, receives the name of the event to be registered and the associated data
 * @param {string} eventName 
 * @param {object} dataEvent
 * @throws an error when some required params is not passed
 * @example logCustomEvent('event_init',{date:"2011-10-05T14:48:00.000Z"})
 */

const logCustomEvent = async (eventName,dataEvent) => {

    try {
        if(!eventName || !isString(eventName)) throw new Error('Event name is required');

        if(!dataEvent || !Object.keys(dataEvent).length) throw new Error('Event data is required');
    
        await analytics().logEvent(eventName,dataEvent)
    } catch (error) {
        console.log('custom_Event: ', error)
    }
}

export default logCustomEvent;