import customEvent from '../lib/customEvent';
import * as utils from '../lib/utils';

describe('customEvent method', () => {
  const invalidArgument = [];

  describe('thows an error when', () => {
    const mockedDevEnv = jest.spyOn(utils, 'isDevEnv');

    it('not pass a valid string as an eventName argument', async () => {
      mockedDevEnv.mockReturnValueOnce(false);
      expect(await customEvent(invalidArgument, {})).toBe(false);
    });

    it('not pass a valid object as a dataEvent argument', async () => {
      expect(await customEvent('event_name', invalidArgument)).toBe(false);
    });
  });

  describe('register an event', () => {
    it('when receive a valid eventName an a valid dataEvent', async () => {
      const validParams = {
        actionName: 'buttonPress',
        client: 'janis',
        userEmail: 'janis@janis.im',
        userId: 'user2022Janis',
        appVersion: '1.20.0',
        user: '',
        warehouse: 'Belgrano',
        rol: 'picker',
        language: 'EN-US',
        connection: 'wifi',
        deviceId: '12345',
      };

      const event = await customEvent('event_name', validParams);

      expect(event).toBe(true);
    });
  });

  describe('can receive a custom string array that represent required params for some custom event', () => {
    describe('this array is validate and', () => {
      it('is invalid argument, should will be replaced by an empty array and the action complete normally', async () => {
        const validParams = {
          actionName: 'buttonPress',
          client: 'janis',
          userEmail: 'janis@janis.im',
          userId: 'user2022Janis',
          appVersion: '1.20.0',
          user: '',
          warehouse: 'Belgrano',
          rol: 'picker',
          language: 'EN-US',
          connection: 'wifi',
          deviceId: '12345',
        };

        const event = await customEvent('event_name', validParams, {});

        expect(event).toBe(true);
      });

      it('is valid argument, filter invalid array elements and pass remaining for validation', async () => {
        const validParams = {
          actionName: 'buttonPress',
          client: 'janis',
          userEmail: 'janis@janis.im',
          userId: 'user2022Janis',
          appVersion: '1.20.0',
          user: '',
          warehouse: 'Belgrano',
          rol: 'picker',
          language: 'EN-US',
          connection: 'wifi',
          deviceId: '12345',
        };

        const event = await customEvent('event_name', validParams, [
          'rol',
          3,
          'actionName',
        ]);

        expect(event).toBe(true);
      });
    });
  });
});
