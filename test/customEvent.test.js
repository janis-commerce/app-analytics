import customEvent from '../lib/customEvent';

describe('customEvent method', () => {
  const invalidArgument = []

  describe('thows an error when', () => {
    it('not pass a valid string as an eventName argument', async () => {
      __DEV__ = true
      expect(await customEvent(invalidArgument,{})).toBe(false)
      });
    });

    it('not pass a valid object as a dataEvent argument', async () => {
      __DEV__ = false
      expect(await customEvent('event_name',invalidArgument)).toBe(false)
    });
  });

  describe('register an event', () => {
    it('when receive a valid eventName an a valid dataEvent', async () => {
      const dataEvent = {user: 'figaro', warehouse: 'Belgrano', rol: 'picker'};

      const event = await customEvent('event_name', dataEvent);

      expect(event).toBe(true);
    });
  });
