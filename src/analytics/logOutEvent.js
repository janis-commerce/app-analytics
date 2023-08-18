import analytics from '@react-native-firebase/analytics';
import {isString} from '@janiscommerce/apps-helpers'

/**
 * @name logOutEvent
 * @description send a logout custom event to firebase console.
 * Logout event should be used when the user logs out from the user menu
 * @example logOutEvent()
 */

const logOutEvent = async (methodMessage) => {

    try {
        const message = isString(methodMessage) ? methodMessage : 'manual_logout'

        await analytics().logEvent('logOut',{
            method: message
     })
    } catch (error) {
        console.log('log_out error:', error)
    }
}

export default logOutEvent;