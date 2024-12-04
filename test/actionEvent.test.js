import actionEvent from '../lib/actionEvent';

describe('actionEvent method', () => {
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
  };
  describe('throws an error when', () => {
    it('not pass a valid object as an argument', async () => {
      expect(await actionEvent({})).toBe(false);
    });

    it('not pass all required data or this hasnt value', async () => {
      expect(
        await actionEvent({
          actionName: 'buttonPress',
          client: 'janis',
          userEmail: '',
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
