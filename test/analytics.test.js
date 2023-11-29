import Analytics from '../lib/analitics';
import userInfoEvent from '../lib/userInfoEvent';
import actionEvent from '../lib/actionEvent';
import customEvent from '../lib/customEvent';
import screenViewEvent from '../lib/screenViewEvent';
import * as utils from '../lib/utils';

const eventData = {
  language: 'en-US',
  appName: 'janis-app',
  device: 'SM-102',
  osVersion: 'android 12',
  userEmail: 'janis@janis.im',
  userId: 'a1b2c3d4e5f6g7',
  client: 'janis',
  appVersion: '1.22.0',
};

jest.mock('../lib/userInfoEvent');
jest.mock('../lib/actionEvent');
jest.mock('../lib/customEvent');
jest.mock('../lib/screenViewEvent');

describe('Anaylytics class', () => {
  const mockedDevEnv = jest.spyOn(utils, 'isDevEnv');

  describe('return methods to send events to analytics', () => {
    it('once handler is instantiated methods are available', () => {
      const analytics = new Analytics();

      expect(typeof analytics.sendAction).toBe('function');
    });
  });

  describe('sendUserInfo method', () => {
    it('send userInfo event to analytics when running in productive environments', () => {
      mockedDevEnv.mockReturnValueOnce(false);

      const analytics = new Analytics(eventData);
      analytics.sendUserInfo();

      expect(userInfoEvent).toBeCalled();
    });

    it('should not send the event in development environments', () => {
      mockedDevEnv.mockReturnValueOnce(true);

      const analytics = new Analytics();
      analytics.sendUserInfo();

      expect(userInfoEvent).not.toBeCalled();
    });
  });

  describe('sendAction method', () => {
    it('send userInfo event to analytics when running in productive environments', () => {
      mockedDevEnv.mockReturnValueOnce(false);

      const analytics = new Analytics({...eventData, screenName: 'Home'});

      analytics.sendAction('on press button', {
        screen: 'home',
        userRol: 'picker',
      });

      expect(actionEvent).toBeCalled();
    });

    it('should not send the event in development environments', () => {
      mockedDevEnv.mockReturnValueOnce(true);

      const analytics = new Analytics(eventData);

      analytics.sendAction('on press button', []);

      expect(actionEvent).not.toBeCalled();
    });
  });

  describe('sendCustomEvent method', () => {
    it('send customEvent to analytics when running in productive environments', () => {
      mockedDevEnv.mockReturnValueOnce(false);

      const analytics = new Analytics(eventData);

      analytics.sendCustomEvent('customTest', {
        rol: 'dev',
        location: 'palermo',
      });

      expect(customEvent).toBeCalled();
    });

    it('should not send the event in development environments', () => {
      mockedDevEnv.mockReturnValueOnce(true);

      const analytics = new Analytics({});

      analytics.sendCustomEvent('customTest', 'testing value');

      expect(customEvent).not.toBeCalled();
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
