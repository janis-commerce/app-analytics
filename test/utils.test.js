import requiredInitialData from '../lib/constant/requiredInitialData';
import {
  formatValue,
  showErrorInDebug,
  validateRequiredStringParams,
  splitRequiredAndRemainingParams,
  formatBasicData,
  validObjectWithValues,
  promiseWrapper,
  includesAllProperties,
  updateRequiredParams,
} from '../lib/utils';

describe('formatValue function', () => {
  it('return null when not receive a valid argument', () => {
    expect(formatValue(undefined)).toStrictEqual(null);
  });

  it('if it receives a value that is not of type string, then it transforms it and returns the formatted value', () => {
    expect(formatValue([3212313213])).toBe('[3212313213]');
  });
});

describe('updateRequiredParams function', () => {
  describe('returns default required params when', () => {
    it('received params is not a valid array', () => {
      expect(updateRequiredParams({})).toBe(requiredInitialData);
    });

    it('received array is empty', () => {
      expect(updateRequiredParams([])).toBe(requiredInitialData);
    });
  });

  it('returns updated required params when receive a valid array with elements', () => {
    expect(updateRequiredParams(['userName', 'screenName'])).toStrictEqual([
      ...requiredInitialData,
      'userName',
      'screenName',
    ]);
  });
});

describe('validateRequiredStringParams function', () => {
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
      expect(() => validateRequiredStringParams({})).toThrow(
        'params are required',
      );
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
  it('return null', () => {
    expect(showErrorInDebug({message: 'message'}, true)).toStrictEqual(null);
  });
});

describe('splitRequiredAndRemainingParams function', () => {
  const params = {
    rol: 'dev',
    client: 'JANIS',
    userEmail: 'janis@janis.im',
    userId: '',
  };

  const requiredParams = ['client', 'userEmail', 'userId'];

  it('returns an array with two empty object when not receive params', () => {
    expect(splitRequiredAndRemainingParams()).toStrictEqual([{}, {}]);
  });

  it('returns an array with an object and the received params when not pass required params', () => {
    expect(splitRequiredAndRemainingParams(params)).toStrictEqual([
      {client: 'janis', userEmail: 'janis@janis.im'},
      {rol: 'dev'},
    ]);
  });

  it('returns an array with required and remaining params when pass required params', () => {
    expect(
      splitRequiredAndRemainingParams(params, requiredParams),
    ).toStrictEqual([
      {client: 'janis', userEmail: 'janis@janis.im'},
      {rol: 'dev'},
    ]);
  });

  it('returns the required params formatted when receiving a callback as the third argument', () => {
    expect(
      splitRequiredAndRemainingParams(params, requiredParams, formatValue),
    ).toStrictEqual([
      {client: 'janis', userEmail: 'janis@janis.im'},
      {rol: 'dev'},
    ]);
  });
});

describe('formatBasicData function', () => {
  const params = {
    userEmail: 'janis@janis.im',
    userId: 'janis12345',
    appVersion: '1.22.0',
  };

  const basicData = {
    userEmail: '',
    userId: '',
    client: '',
    appVersion: '',
    language: '',
    connection: '',
    deviceId: '',
  };
  it('return an object with keys with empty values when not receives valid params', () => {
    expect(formatBasicData()).toStrictEqual(basicData);
  });

  it('return an returns an object formatted based on the parameters received', () => {
    expect(formatBasicData(params)).toStrictEqual({
      userEmail: 'janis@janis.im',
      userId: 'janis12345',
      client: '',
      language: '',
      appVersion: '1.22.0',
      connection: '',
      deviceId: '',
    });
  });
});

describe('validObjectWithValues function', () => {
  it('should return the received object when this pass validations', () => {
    expect(validObjectWithValues({language: 'en-US'})).toStrictEqual({
      language: 'en-US',
    });
  });

  it('should return an empty object when receive an invalid argument', () => {
    expect(validObjectWithValues([])).toStrictEqual({});
  });
});

describe('promiseWrapper', () => {
  describe('return error', () => {
    it('with promise called catch', async () => {
      const promise = await promiseWrapper(
        Promise.reject(new Error('called catch')),
      );
      expect.assertions(3);
      expect(promise).toEqual(expect.any(Array));
      const [data, error] = promise;
      expect(data).toBe(null);
      expect(error).toEqual(expect.any(Object));
    });
  });

  describe('return data', () => {
    it('with promise correct', async () => {
      const prom = () =>
        new Promise((resolve) => resolve({name: 'Janis Picking'}));
      const promise = await promiseWrapper(prom());
      const [data, error] = promise;
      expect.assertions(3);
      expect(promise).toEqual(expect.any(Array));
      expect(data).toEqual(expect.any(Object));
      expect(error).toBe(null);
    });
  });
});

describe('includesAllProperties', () => {
  const invalidValues = [{}, []];
  const dataToCheck = {
    client: 'janis',
    appVersion: '1.22.0',
    userEmail: 'user@janis.im',
    userId: '1234',
    language: 'en-us',
    name: 'janis',
    address: 'costa rica 4988',
    country: 'argentina',
    connection: 'wifi',
    deviceId: 'sams12345-0',
  };
  describe('returns false if', () => {
    it('not receive a valid object as first argument', () => {
      invalidValues.forEach((invalidData) => {
        expect(includesAllProperties(invalidData)).toBeFalsy();
      });
    });

    it('the object not contain some required property', () => {
      expect(
        includesAllProperties(dataToCheck, [
          'name',
          'address',
          'country',
          'foundationYear',
        ]),
      ).toBeFalsy();
    });
  });

  describe('returns true if', () => {
    it('not receive a valid array as second argument', () => {
      invalidValues.forEach((invalidData) => {
        expect(includesAllProperties(dataToCheck, invalidData)).toBeTruthy();
      });
    });

    it('the object contains all required properties', () => {
      expect(
        includesAllProperties(dataToCheck, ['name', 'address', 'country']),
      ).toBeTruthy();
    });
  });
});
