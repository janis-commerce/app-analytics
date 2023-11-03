import {
  formatValue,
  showErrorInDebug,
  validateRequiredStringParams,
} from '../lib/utils';

describe('formatValue function', () => {
  it('return null when not receive a valid argument', () => {
    expect(formatValue(undefined)).toStrictEqual(null);
  });

  it('if it receives a value that is not of type string, then it transforms it and returns the formatted value', () => {
    expect(formatValue([3212313213])).toBe('[3212313213]');
  });
});

describe('validateRequiredStringParams function', () => {
  const validParams = {
    appVersion: '1.21.0',
    client: 'janis',
    userEmail: 'janis@janis.im',
  };

  const validArray = ['appVersion', 'client', 'userEmail'];

  describe('should throw an error when', () => {
    it('receive invalid params', () => {
      expect(() => validateRequiredStringParams({}, validArray)).toThrow(
        'params are required',
      );
    });

    it('receive invalid array', () => {
      expect(validateRequiredStringParams(validParams, [])).toBe(validParams);
    });

    it('when some required params was not pass', () => {
      expect(() =>
        validateRequiredStringParams(
          {...validParams, appVersion: ''},
          validArray,
        ),
      ).toThrow('appVersion property is required');
    });
  });

  it('returns true when all required parameters have been passed', () => {
    expect(validateRequiredStringParams(validParams, validArray)).toStrictEqual(
      true,
    );
  });
});

describe('showErrorInDebug function', () => {
  afterEach(() => {
    delete process.env.NODE_ENV;
  });

  it('return null', () => {
    process.env.NODE_ENV = 'production';
    expect(showErrorInDebug({message: 'message'})).toStrictEqual(null);
  });
});
