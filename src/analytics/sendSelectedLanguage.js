import analytics from "@react-native-firebase/analytics";
import {isString} from '@janiscommerce/apps-helpers'

const sendSelectedLanguage = async (language) => {
    if(!language || !isString(language)) 
        throw new Error('language is required');

    await analytics().logEvent('selected_language',{
        language:language,
    })
}

export default sendSelectedLanguage;