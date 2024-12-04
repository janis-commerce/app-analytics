import screenViewEvent from '../lib/screenViewEvent';
import * as utils from '../lib/utils';

describe('screenViewEvent', () => {
  describe('throws an error and return false when', () => {
    const mockedDevEnv = jest.spyOn(utils, 'isDevEnv');
    it('not receive a screenName into params', async () => {
      mockedDevEnv.mockReturnValueOnce(true);
      expect(await screenViewEvent()).toBe(false);
    });

    it('not receive a valid screenName argument', async () => {
      mockedDevEnv.mockReturnValueOnce(false);
      expect(await screenViewEvent(2323)).toBe(false);
    });
  });

  it('register an event when pass an object with valid data', async () => {
    const eventResponse = await screenViewEvent('screen name', 'screen class');

    expect(eventResponse).toStrictEqual(true);
  });

  it('register an event with extra params when pass an object with valid data', async () => {
    const eventResponse = await screenViewEvent('screen name', 'screen class', {
      client: 'janis',
      userEmail: 'janis@janis.im',
      userId: '12345',
      connection: 'wifi',
      deviceId: '12345',
    });

    expect(eventResponse).toStrictEqual(true);
  });
});
