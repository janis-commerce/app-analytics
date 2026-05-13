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

/** *
 * @name validateData
 * @description This function is responsible for validating that the data object contains all required keys with non-empty string values
 * @param {object} data data that must be validated
 * @param {array} requiredKeys It is an array of strings with the keys that have to be validated in the data object
 * @throws  an error when not receive data or the data does not contain a required key
 * @return {boolean}
 * @example
 * validateData({rol:'dev',environment:'prod'},['rol','environment']) => true
 */

export const validateData = (data, requiredKeys = []) => {
  if (!data || !Object.keys(data).length)
    throw new Error('params are required');

  requiredKeys.forEach((key) => {
    const value = data[key];
    if (!value || typeof value !== 'string')
      throw new Error(`${key} property is required`);
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

/** *
 * @name normalizeParams
 * @description returns an object based on the received argument, and determines if it is valid depending on whether it has keys
 * @param {object} params the object to be evaluated
 * @returns {object}
 * @example
 *
 * normalizeParams({language:'en-US}) => true;
 * normalizeParams({}) => false;
 * normalizeParams([]) => false;
 */

export const normalizeParams = (object) => {
  if (typeof object !== 'object' || !Object.keys(object).length) return {};

  return object;
};
