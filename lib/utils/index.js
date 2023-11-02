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

export const formatValue = (value) => {
  if (!value) return null;

  let receivedValue = value;

  if (typeof receivedValue !== 'string') {
    receivedValue = JSON.stringify(receivedValue);
  }

  return receivedValue.replace(/\s+/g, '_').toLowerCase();
};

export const validateRequiredStringParams = async (params, arr) => {
  if (!params || !Object.keys(params).length)
    throw new Error('params are required');

  if (!arr || !(arr instanceof Array) || !arr.length) return params;

  const requiredParams = arr;

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
