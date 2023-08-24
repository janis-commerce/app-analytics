import userInfoEvent from '../lib/userInfoEvent';

describe('userInfoEvent method', () => {
  const invalidParams = [[], {}, '', 0];
  describe('returns an error when', () => {
    it('not receive a valid object as argument', () => {
      invalidParams.forEach(async (argument) => {
        await expect(userInfoEvent(argument)).rejects.toThrow(
          'Params are required',
        );
      });
    });

    it('not pass an object with valid data', () => {
      invalidParams.forEach(async (argument) => {
        const eventData = {
          appName: argument,
          appVersion: argument,
          device: argument,
          os: argument,
          osVersion: argument,
          userName: argument,
          userId: argument,
          language: argument,
        };

        await expect(userInfoEvent(eventData)).rejects.toThrow(
          'Event data is required',
        );
      });
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
    };

    const eventResponse = await userInfoEvent(eventData);

    expect(eventResponse).toStrictEqual(true);
  });
});
