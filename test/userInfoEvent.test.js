import userInfoEvent from '../lib/userInfoEvent';

describe('userInfoEvent method',() => {
  describe('returns an error when',() => {
    it('not receive a valid object as argument', async () => {
        __DEV__ = true
        expect(await userInfoEvent({})).toBe(false)
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
            client: ''
          };
  
          __DEV__ = false
         expect(await userInfoEvent(eventData)).toBe(false)
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
        client: 'janis'
      };

      const eventResponse = await userInfoEvent(eventData);
  
      expect(eventResponse).toStrictEqual(true);
    });
  });