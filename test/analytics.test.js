import {waitFor} from '@testing-library/react-native';
import {getUserInfo} from '@janiscommerce/oauth-native';
import Analytics from '../lib/analytics';
import userInfoEvent from '../lib/userInfoEvent';
import actionEvent from '../lib/actionEvent';
import customEvent from '../lib/customEvent';
import screenViewEvent from '../lib/screenViewEvent';
import * as utils from '../lib/utils';

jest.mock('../lib/userInfoEvent');
jest.mock('../lib/actionEvent');
jest.mock('../lib/customEvent');
jest.mock('../lib/screenViewEvent');

const userInfoResponse = {
  appClientId: 'abcd1234-1234-g4g4-828b-BFAS2121fjA',
  aud: 'abcd1234-1234-g4g4-828b-BFAS2121fjA',
  createdAt: '2020-12-14T18:45:28.306Z',
  email: 'janis@janis.im',
  exp: 1697285104,
  family_name: 'SRL',
  given_name: 'janis',
  iat: 1697112304,
  images: {
    big: 'https://www.gravatar.com/avatar/034caa1d46010b8624d1b8cffaee9a88?d=404&s=512',
  },
  isDev: true,
  iss: 'https://id.janisdev.in',
  locale: 'en-US',
  mainColor: '#e70c6e',
  name: 'Janis SRL',
  profileName: 'Admin',
  refId: null,
  secondaryColor: '#fbfaf8',
  sub: '5fd7b2c8d71fb1e2743bb64e',
  tcode: 'validtcode',
  tcurrency: 'ARS',
  tcurrencyDisplay: 'symbol',
  tid: '631fab63f3f96415abfeabd8',
  timage:
    'https://cdn.id.janisdev.in/client-images/631fab63f3f96415abfeabd8/b25d5d55-52a5-41f8-bf22-43fc0963c875.png',
  tname: 'Fizzmod',
  updated_at: 1697053475,
};

describe('Anaylytics class', () => {
  const mockedDevEnv = jest.spyOn(utils, 'isDevEnv');
  const spyGetUserInfo = jest.spyOn({getUserInfo}, 'getUserInfo');

  describe('return methods to send events to analytics', () => {
    it('once handler is instantiated methods are available', () => {
      const analytics = new Analytics({appVersion: '1.22.0.0'});

      expect(typeof analytics.sendAction).toBe('function');
    });
  });

  describe('initialize method return', () => {
    it('event data is returned without executing getUserInfo if event data already has information loaded.', async () => {
      const analytics = new Analytics({
        appVersion: '1.22.0.0',
        userEmail: 'janis@janis.im',
        userId: 'janis1234',
        client: 'janis',
        language: 'language',
      });

      expect(await analytics.initialize('1.22.0.0')).toStrictEqual({
        appVersion: '1.22.0.0',
        userEmail: 'janis@janis.im',
        userId: 'janis1234',
        client: 'janis',
        language: 'language',
      });
    });

    it('return eventData with only appVersion when getUserInfo fails', async () => {
      spyGetUserInfo.mockRejectedValueOnce(new Error('getUserInfo failed'));

      const analytics = new Analytics({appVersion: '1.22.0.0'});

      expect(await analytics.initialize('1.22.0.0')).toStrictEqual({
        appVersion: '1.22.0.0',
      });
    });

    it('return formatted eventData when getUserInfo returns information', async () => {
      spyGetUserInfo.mockResolvedValueOnce(userInfoResponse);

      const analytics = new Analytics({appVersion: '1.22.0.0'});

      expect(await analytics.initialize('1.22.0.0')).toStrictEqual({
        appVersion: '1.22.0.0',
        client: 'Fizzmod',
        language: 'en-US',
        userEmail: 'janis@janis.im',
        userId: '5fd7b2c8d71fb1e2743bb64e',
      });
    });
  });

  it('return formatted eventData with default data when getUserInfo returns empty information', async () => {
    spyGetUserInfo.mockResolvedValueOnce({});

    const analytics = new Analytics({appVersion: '1.22.0.0'});

    expect(await analytics.initialize('1.22.0.0')).toStrictEqual({
      appVersion: '1.22.0.0',
    });
  });

  describe('sendUserInfo method', () => {
    it('send userInfo event to analytics when running in productive environments', async () => {
      spyGetUserInfo.mockReturnValueOnce(userInfoResponse);
      mockedDevEnv.mockReturnValueOnce(false).mockReturnValueOnce(false);

      const analytics = new Analytics({appVersion: '1.22.0.0'});
      analytics.sendUserInfo();

      await waitFor(() => {
        expect(userInfoEvent).toBeCalled();
      });
    });

    it('should not send the event in development environments', async () => {
      mockedDevEnv.mockReturnValueOnce(true);

      const analytics = new Analytics();
      analytics.sendUserInfo();

      await waitFor(() => {
        expect(userInfoEvent).not.toBeCalled();
      });
    });
  });

  describe('sendAction method', () => {
    it('send userInfo event to analytics when running in productive environments', async () => {
      mockedDevEnv.mockReturnValueOnce(false).mockReturnValueOnce(false);

      const analytics = new Analytics({appVersion: '1.22.0.0'});

      analytics.sendAction('on press button', 'home', {
        userRol: 'picker',
      });

      await waitFor(() => {
        expect(actionEvent).toBeCalled();
      });
    });

    it('should not send the event in development environments', async () => {
      mockedDevEnv.mockReturnValueOnce(true);

      const analytics = new Analytics({appVersion: '1.22.0.0'});

      analytics.sendAction('on press button', []);

      await waitFor(() => {
        expect(actionEvent).not.toBeCalled();
      });
    });
  });

  describe('sendCustomEvent method', () => {
    it('send customEvent to analytics when running in productive environments', async () => {
      mockedDevEnv.mockReturnValueOnce(false).mockReturnValueOnce(false);

      const analytics = new Analytics({appVersion: '1.22.0.0'});

      analytics.sendCustomEvent('customTest', {
        rol: 'dev',
        location: 'palermo',
      });

      await waitFor(() => {
        expect(customEvent).toBeCalled();
      });
    });

    it('should not send the event in development environments', async () => {
      mockedDevEnv.mockReturnValueOnce(true);

      const analytics = new Analytics({appVersion: '1.22.0.0'});

      analytics.sendCustomEvent('customTest', 'testing value');

      await waitFor(() => {
        expect(customEvent).not.toBeCalled();
      });
    });
  });

  describe('sendScreenTracking', () => {
    it('send screenViewEvent to analytics when running in productive environments', () => {
      mockedDevEnv.mockReturnValueOnce(false);

      Analytics.sendScreenTracking('Home', 'Home');

      expect(screenViewEvent).toBeCalled();
    });

    it('should not send the event in development environments', () => {
      mockedDevEnv.mockReturnValueOnce(true);

      Analytics.sendScreenTracking('Home', 'Home');

      expect(screenViewEvent).not.toBeCalled();
    });
  });
});
