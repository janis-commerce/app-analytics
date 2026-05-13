import actionEvent from '../lib/actionEvent';
import * as utils from '../lib/utils';

describe('actionEvent method', () => {
  const mockedDevEnv = jest.spyOn(utils, 'isDevEnv');
  const validParams = {
    actionName: 'button Press',
    client: 'janis',
    userEmail: 'janis@janis.im',
    userId: 'user2022Janis',
    appVersion: '1.20.0',
    screenName: 'Home',
    language: 'EN-US',
    connection: 'wifi',
    deviceId: '12345',
    userProfile: 'Admin',
  };
  describe('throws an error when', () => {
    it('not pass a valid object as an argument', async () => {
      mockedDevEnv.mockReturnValueOnce(false);
      expect(await actionEvent({})).toBe(false);
    });

    it('not pass actionName', async () => {
      mockedDevEnv.mockReturnValueOnce(true);
      expect(
        await actionEvent({
          client: 'janis',
          appVersion: '1.0.0',
        }),
      ).toBe(false);
    });
  });

  describe('register an event', () => {
    it('when receive all required data', async () => {
      expect(
        await actionEvent({
          ...validParams,
          name: 'user_janis',
          lastName: '',
          clientRef: 'janis2023',
        }),
      ).toBe(true);
    });
  });
});
