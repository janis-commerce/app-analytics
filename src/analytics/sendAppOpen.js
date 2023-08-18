import analytics from "@react-native-firebase/analytics";

/**
 * @name sendAppOpen
 * @description allows to log an open event every time the app comes to the foreground
 * @example sendAppOpen()
 */

const sendAppOpen = async () => {
    try {
        await analytics().logAppOpen()
    }
    catch (error) {
        console.log('app_open_error', error)
    }
}

export default sendAppOpen;