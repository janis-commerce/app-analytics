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

export const validateRequiredStringParams = (params, requiredParams) => {
  if (!params || !Object.keys(params).length)
    throw new Error('params are required');

  if (
    !requiredParams ||
    !Array.isArray(requiredParams) ||
    !requiredParams.length
  )
    return false;

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

export const showErrorInDebug = (error) => {
  if (isDevEnv()) {
    console.error(error.message);
  }
  return null;
};

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
