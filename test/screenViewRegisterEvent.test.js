import screenViewRegisterEvent from '../lib/screenViewRegisterEvent';
import * as utils from '../lib/utils';

describe('screenViewRegisterEvent', () => {
  describe('throws an error and return false when', () => {
    const mockedDevEnv = jest.spyOn(utils, 'isDevEnv');
    it('not receive a screenName into params', async () => {
      mockedDevEnv.mockReturnValueOnce(true);
      expect(await screenViewRegisterEvent()).toBe(false);
    });

    it('not receive a valid screenName argument', async () => {
      mockedDevEnv.mockReturnValueOnce(false);
      expect(await screenViewRegisterEvent(2323)).toBe(false);
    });
  });

  it('register an event when pass an object with valid data', async () => {
    const eventResponse = await screenViewRegisterEvent(
      'screen class',
      'screen name',
    );

    expect(eventResponse).toStrictEqual(true);
  });
});
