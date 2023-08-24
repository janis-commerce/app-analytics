import customEvent from '../lib/customEvent';

describe('customEvent method', () => {
  const invalidParams = [[], {}, '', 0];
  describe('thows an error when', () => {
    it('not pass a valid string as an eventName argument', () => {
      invalidParams.forEach(async (eventName) => {
        await expect(customEvent(eventName, {})).rejects.toThrow(
          'Event name is required',
        );
      });
    });

    it('not pass a valid object as a dataEvent argument', () => {
      invalidParams.forEach(async (dataEvent) => {
        await expect(customEvent('event_name', dataEvent)).rejects.toThrow(
          'Event data is required',
        );
      });
    });
  });

  describe('register an event', () => {
    it('when receieve a valid eventName an a valid dataEvent', async () => {
      const dataEvent = {user: 'figaro', warehouse: 'Belgrano', rol: 'picker'};

      const event = await customEvent('event_name', dataEvent);

      expect(event).toBe(true);
    });
  });
});
