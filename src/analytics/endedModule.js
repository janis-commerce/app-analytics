import analytics from "@react-native-firebase/analytics";
import {isString, isObject} from '@janiscommerce/apps-helpers'

/**
 * @name endedModule
 * @description sends an event notifying which flow was finished
 * @param {object} params
 * @param {string} params.moduleName 
 * @throws an error when params was not pass
 * @throws an error when module name was not pass
 * @example endedModule({moduleName:'flow_1'})
 * @example endedModule({moduleName:'flow_2', warehouse: 'Palermo', client:'carrefour'})
 */

const endedModule = async (params) => {

    if(!params || !isObject(params)) throw new Error('Params are required')

    const {moduleName, ...props} = params

    if(!moduleName || !isString(moduleName)) throw new Error('Module name is required')

    await analytics().logEvent('module_start', {
        module: moduleName,
        ...props,
    })
}

export default endedModule;