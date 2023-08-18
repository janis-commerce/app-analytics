import analytics from "@react-native-firebase/analytics";
import {isString, isObject} from '@janiscommerce/apps-helpers'

/**
 * @name initModule
 * @description sends an event notifying which flow was init
 * @param {object} params
 * @param {string} params.moduleName 
 * @throws an error when params was not pass
 * @throws an error when module name was not pass
 * @example initModule({moduleName:'flow_1'})
 * @example initModule({moduleName:'flow_2', warehouse: 'Palermo', client:'carrefour'})
 */

const initModule = async (params) => {
    try {
        if(!params || !isObject(params)) throw new Error('Params are required')

        const {moduleName, ...props} = params
    
        if(!moduleName || !isString(moduleName)) throw new Error('Module name is required')
    
        await analytics().logEvent('module_start', {
            module: moduleName,
            ...props,
        })
    }catch (error) {
        console.log('init_module_error:', error)
    }

   
}

export default initModule;