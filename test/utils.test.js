import {showErrorInDebug, validateData, normalizeParams} from '../lib/utils';

describe('validateData function', () => {
  const validParams = {
    appVersion: '1.21.0',
    client: 'janis',
    userEmail: 'janis@janis.im',
    userId: '1234',
    language: 'en-US',
    deviceId: '12345',
    connection: 'wifi',
  };

  const validArray = ['appVersion', 'client', 'userEmail'];

  describe('should throw an error when', () => {
    it('receive invalid params', () => {
      expect(() => validateData({})).toThrow('params are required');
    });
    it('when some required params was not pass', () => {
      expect(() =>
        validateData({...validParams, appVersion: ''}, validArray),
      ).toThrow('appVersion property is required');
    });
  });

  it('returns true when all required parameters have been passed', () => {
    expect(validateData(validParams, validArray)).toStrictEqual(true);
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

describe('normalizeParams function', () => {
  it('should return the received object when this pass validations', () => {
    expect(normalizeParams({language: 'en-US'})).toStrictEqual({
      language: 'en-US',
    });
  });

  it('should return an empty object when receive an invalid argument', () => {
    expect(normalizeParams([])).toStrictEqual({});
  });
});
