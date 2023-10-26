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
    receivedValue = receivedValue.toString();
  }

  return receivedValue.replace(/\s+/g, '_').toLowerCase();
};
