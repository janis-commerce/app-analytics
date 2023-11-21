/* istanbul ignore next */
/**
 * @name isDevEnv
 * @returns true if node env is development
 */
export const isDevEnv = () => {
  const {env} = process;
  const {NODE_ENV} = env;
  return NODE_ENV !== 'production';
};

/**
 * @name formatValue
 * @description is responsible for formatting the received value, reducing it to lowercase and replacing spaces with underscores
 * @param {any} value the value that you wanted format
 * @returns will return the formatted value or a null value if a valid value is not received
 */

export const formatValue = (value) => {
  if (!value) return null;

  let receivedValue = value;

  if (typeof receivedValue !== 'string') {
    receivedValue = JSON.stringify(receivedValue);
  }

  return receivedValue.replace(/\s+/g, '_').toLowerCase();
};

/** *
 * @name validateRequiredStringParams
 * @description This function is responsible for validating that the parameters you want to send contain the parameters considered required for the event
 * @param {object} params data that must be validated
 * @param {array} requiredParams It is an array of strings with the keys that have to be validated in the parameters
 * @throws  an error when not receive params or the params not contain a required key
 * @return {boolean}
 * @example
 * validateRequiredStringParams({rol:'dev',environment:'prod'},['rol','environment']) => true
 */

export const validateRequiredStringParams = (params, requiredParams) => {
  if (!params || !Object.keys(params).length)
    throw new Error('params are required');

  if (
    !requiredParams ||
    !Array.isArray(requiredParams) ||
    !requiredParams.length
  )
    throw new Error('required params were not defined');

  requiredParams.forEach((requiredKey) => {
    if (
      !(requiredKey in params) ||
      typeof params[requiredKey] !== 'string' ||
      !params[requiredKey]?.length
    )
      throw new Error(`${requiredKey} property is required`);
  });

  return true;
};

/**
 * @name showErrorInDebug
 * @description This function is responsible for sending the error to the console when it is in the development environment
 * @param {Error} error The error received
 * @returns {null}
 */

export const showErrorInDebug = (error) => {
  if (isDevEnv()) {
    console.error(error.message);
  }
  return null;
};

/**
 * @name splitRequiredAndRemainingParams
 * @description This function returns an array with two objects that separate the required parameters from the remaining ones.
 * @param {object} params  the object that contains the parameters that will be sent
 * @param {array} requiredParams It is an array of strings with the keys that have to be validated in the parameters
 * @param {function} callback It must be a function, which will be in charge of formatting the value that will be assigned in the keys of the required parameters
 * @returns {array} returns an array with two objects
 * @example
 * splitRequiredAndRemainingParams({rol:'dev',client:'janis', environment:'prod'},['rol','client']) => [{rol:'dev',client:'janis'},{environment:'prod'}]
 */

export const splitRequiredAndRemainingParams = (
  params,
  requiredParams,
  callback,
) => {
  if (!params || !Object.keys(params).length) return [{}, {}];

  if (
    !requiredParams ||
    !Array.isArray(requiredParams) ||
    !requiredParams.length
  )
    return [{}, params];

  const validCallback = typeof callback === 'function';

  const [requiredData, remainingData] = Object.keys(params).reduce(
    ([required, remaining], key) => {
      if (requiredParams.includes(key)) {
        required[key] = validCallback
          ? callback(params[key])
          : params[key].toLowerCase();

        return [required, remaining];
      }

      if (params[key]) {
        remaining[key] = params[key];
      }

      return [required, remaining];
    },
    [{}, {}],
  );

  return [requiredData, remainingData];
};

/** *
 * @name formatBasicData
 * @description returns an object with basic data keys for events
 * @param {object} params the data received to be formatted
 * @returns an object with the keys userEmail, userId, client y appVersion
 * @example
 *
 * formatBasicData({client:'janis',userEmail:janis@janis.im,warehouse:'palermo'}) => {client:'janis',userEmail:'janis@janis.im',userId:'',appVersion:''}
 */

export const formatBasicData = (params) => {
  const basicData = {
    userEmail: '',
    userId: '',
    client: '',
    appVersion: '',
  };

  if (!params || !Object.keys(params).length || typeof params !== 'object')
    return basicData;

  Object.keys(basicData).forEach((key) => {
    basicData[key] = params[key] || '';
  });

  return basicData;
};

/** *
 * @name validObjectWithValues
 * @description returns an object based on the received argument, and determines if it is valid depending on whether it has keys
 * @param {object} params the object to be evaluated
 * @returns {object}
 * @example
 *
 * validObjectWithValues({language:'en-US}) => true;
 * validObjectWithValues({}) => false;
 * validObjectWithValues([]) => false;
 */

export const validObjectWithValues = (object) => {
  if (typeof object !== 'object' || !Object.keys(object).length) return {};

  return object;
};
