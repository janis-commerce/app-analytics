module.exports = {
  env: {
    es6: true,
    jest: true,
  },
  extends: ['airbnb', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    __DEV__: 'readonly',
    fetch: false,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-env'],
    },
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [
      'off',
      {
        extensions: ['.jsx', '.js'],
      },
    ],
    'import/prefer-default-export': 'off',
    'react/state-in-constructor': 'off',
    'react/static-property-placement': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'no-param-reassign': 'off',
    'no-console': 'off',
    'no-restricted-exports': 'off',
    'default-param-last': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {devDependencies: true, peerDependencies: true},
    ],
  },
  overrides: [
    {
      files: ['setupTest/**/*.js', '__mocks__/**/*.js'],
      rules: {
        'no-underscore-dangle': 'off',
        'func-names': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
      },
    },
    {
      files: ['test/**/*.js'],
      rules: {
        'no-promise-executor-return': 'off',
      },
    },
  ],
};
