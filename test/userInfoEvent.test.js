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
        userEmail: '',
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
      osVersion: '12',
      userEmail: 'User_Name@janis.im',
      userId: '000123456789',
      deviceId: '12345',
      connection: 'wifi',
      language: 'ES-AR',
      client: 'janis',
      screenSize: {
        screenWidth: '480',
        screenHeight: '840',
      },
    };

    const eventResponse = await userInfoEvent(eventData);

    expect(eventResponse).toStrictEqual(true);
  });

  it('register an event without screenSize if screenWidth or screenHeight arent defined', async () => {
    const eventData = {
      appName: 'janis_app',
      appVersion: '1.0.0',
      device: 'samsung',
      osVersion: '12',
      userEmail: 'User_Name@janis.im',
      userId: '000123456789',
      deviceId: '12345',
      connection: 'wifi',
      language: 'ES-AR',
      client: 'janis',
      screenSize: {
        screenWidth: '480',
        screenHeight: '840',
      },
    };

    const eventResponse = await userInfoEvent(eventData);

    expect(eventResponse).toStrictEqual(true);
  });
});
