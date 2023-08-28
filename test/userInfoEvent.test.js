import userInfoEvent from '../lib/userInfoEvent';
import * as utils from '../lib/utils';

describe('userInfoEvent method', () => {
  describe('returns an error when', () => {
    const mockedDevEnv = jest.spyOn(utils, 'isDevEnv');
    it('not receive a valid object as argument', async () => {
      mockedDevEnv.mockReturnValueOnce(false);
      expect(await userInfoEvent({})).toBe(false);
    });
    it('not pass an object with valid data', async () => {
      const eventData = {
        appName: '',
        appVersion: '',
        device: '',
        os: '',
        osVersion: '',
        userName: '',
        userId: '',
        language: '',
        client: '',
      };
      expect(await userInfoEvent(eventData)).toBe(false);
    });
  });
  it('register an event when pass an object with valid data', async () => {
    const eventData = {
      appName: 'janis_app',
      appVersion: '1.0.0',
      device: 'samsung',
      os: 'android',
      osVersion: '12',
      userName: 'User Name',
      userId: '000123456789',
      language: 'ES-AR',
      client: 'janis',
    };

    const eventResponse = await userInfoEvent(eventData);

    expect(eventResponse).toStrictEqual(true);
  });
});
