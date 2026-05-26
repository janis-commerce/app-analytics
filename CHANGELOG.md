# Changelog

## [Unreleased]

### Fixed

- `setSession()` now preserves dynamic user properties previously set via `setUserProperties()` instead of overwriting them.

## [4.0.0] - 2026-05-22

### Breaking Changes

- User identity fields (`userEmail`, `userId`, `client`, `language`, `userProfile`) no longer travel as params in Firebase events. They are now registered once per session via Firebase user properties (`setUserId`, `setUserProperties`).
- `initialize()` removed. Replace with `setSession()` at login.
- `sendUserInfo()` removed. Replace with `setSession()` at login.
- `sendCustomEvent()` signature changed: now takes positional arguments `(eventName, params)` instead of a single object. The `extraParams`/`dataEvent` serialization has been removed — all params are sent individually to Firebase.
- `Analytics` class now exported directly from `lib/index.js` (previously re-exported from `lib/analytics.js`).

### Added

- `setSession()` — fetches user info from OAuth token and registers identity in Firebase via `setUserId` and `setUserProperties`. Must be called once at login.
- `clearSession()` — clears user identity from Firebase and resets session state. Must be called at logout.
- `setUserProperties(properties)` — updates one or more Firebase user properties after login. Use it for dynamic user attributes that change during the session (e.g. `warehouseId`, `language`).
- Internal package errors are now reported to Crashlytics via `@janiscommerce/app-crashlytics`. They now surface in the Firebase Crashlytics console under non-fatal errors prefixed with `[GA4]`.
- `@janiscommerce/app-crashlytics` is now a required peer dependency (`>=2.3.0-beta.0`).

### Changed

- Migrated all Firebase Analytics calls to the modular API (`getAnalytics`, `logEvent`, `setUserId`, `setUserProperties`, `logScreenView` from `@react-native-firebase/analytics`). This eliminates deprecation warnings about the namespaced API.
- `locale` and `profileName` are no longer required fields in `setSession()`. Only `sub`, `email` and `tcode` are required.
- `clearSession()` now explicitly calls `setUserId(null)` and nullifies every user property registered during the session (including any set via `setUserProperties()`). This prevents identity from leaking to the next user on the same device.
- `clearSession()` preserves `appVersion` and `isDebugMode` in session state so the same instance can be reused after logout/login.
- Error logs emitted by the package are prefixed with `[GA4]` to distinguish them from consumer app logs.
- `userProfile` renamed from `profile` to align with the Firebase user property key.
- If `getNetworkState()` fails, events are still sent with `connection: ''` instead of being aborted.

### Removed

- `sendUserInfo()` method and `lib/userInfoEvent.js`.
- User identity fields from all event params (`userEmail`, `userId`, `client`, `language`, `userProfile`).
- `formatBasicData()` / `getEventBaseData()` utils.
- `requiredInitialData` and `includesAllProperties` helpers.
- `appName` is no longer included as an event param. Firebase Analytics exposes app identity natively (`app_info.id` in BigQuery, "App name" dimension in GA4).
- `build-docs` npm script, `jsdoc-to-markdown` and `jsdoc-babel` dev dependencies, `template-readme.hbs` and the `Build Readme` GitHub Action. The README is now maintained manually.
- `extraParams`/`dataEvent` serialization from `sendCustomEvent`. All params are now sent individually.

## [3.1.0] - 2026-05-13

### Changed

- Migrated development toolchain to Node 22 LTS.
- Replaced deprecated `babel-eslint` with `@babel/eslint-parser`.
- Replaced deprecated `metro-react-native-babel-preset` with `@react-native/babel-preset`.
- Upgraded ESLint 7 to 8, `eslint-config-airbnb` 18 to 19, Prettier 2 to 3.
- Upgraded Jest 28 and `babel-jest` 26 to 29.
- Upgraded Husky 4 to 9 and `lint-staged` 10 to 15.
- Aligned `react` and `react-native` dev dependencies with apps (React 19.1.0, RN 0.80.2).
- Modernized GitHub Actions workflows to `actions/checkout@v4` and `actions/setup-node@v4`.

### Removed

- Removed unused dev dependencies: `react-test-renderer`, `@testing-library/react-native`, `babel-loader`, `@babel/plugin-proposal-class-properties`, `@babel/plugin-proposal-object-rest-spread`, `@react-native-community/eslint-config`.
- Removed `.flowconfig` (unused Flow remnant from React Native scaffolding).

## [3.0.0] - 2026-05-05

### Breaking Changes

- Firebase peer dependency upgraded to `^21.6.1` (previously `^18.9.0`). Consumers must upgrade `@react-native-firebase/app` and `@react-native-firebase/analytics` to v21+.
- React Native peer dependency range changed to `>=0.71.5 <0.82.0` (previously `>=0.67.5 <0.75.0`). Apps on RN < 0.71.5 are no longer supported.
- `userProfile` is now a required field. If the oauth token does not provide `profileName`, analytics events will not be sent. - [APPSRN-465](https://janiscommerce.atlassian.net/browse/APPSRN-465)

### Added

- Added support for React Native 0.80.2. - [APPSRN-465](https://janiscommerce.atlassian.net/browse/APPSRN-465)
- Added `userProfile` field to all analytics events, extracted from the oauth token's `profileName`. - [APPSRN-465](https://janiscommerce.atlassian.net/browse/APPSRN-465)

### Changed

- Modernized `android/build.gradle` to use the `safeExtGet` pattern, SDK 35, and Java 17.
- Widened react peer dependency range to support React 19 (`>=17.0.2 <20.0.0`).

## [2.6.0] - 2024-11-05

### Added

- Support up to react 19

## [2.5.0] - 2024-12-05

### Changed

- Changed way of controlling debug mode, now you decide whether to show console errors from outside the package. - [APPSRN-346](https://janiscommerce.atlassian.net/browse/APPSRN-346)

## [2.4.0] - 2024-08-15

### Changed

- Removed screenName as required parameter

## [2.3.0] - 2024-04-09

### Added

- Added device id and connection type to analytics tracking data. - [APPSRN-277](https://janiscommerce.atlassian.net/browse/APPSRN-277)

## [2.2.0] - 2024-02-19

### Added

- User data is now sent to analytics in screen view event

## [2.1.0] - 2024-01-25

### Added

- Screen size is now sent to analytics

### Changed

- Changed value of client sent, now we are sending tcode key

## [2.0.0] - 2023-12-18

### Breaking Changes

### Changed

- No longer returns functions. Now returns a class that it's needed to instance in order to use methods.

## [1.6.0] - 2023-11-13

### Added

- Added required params for actionEvent and customEvent

## [1.5.0] - 2023-11-01

### Added

- Added Action event

## [1.4.0] - 2023-10-06

### Added

- Added deprecation message for os key in log function

## [1.3.0] - 2023-09-08

### Added

- Added event screenViewEvent

## [1.2.0] - 2023-09-04

### Added

- Added key userEmail in userEvent function

## [1.2.0] - 2023-09-04

### Added

- Added key userEmail in userEvent function

### Removed

- Removed key userName in userEvent function

## [1.1.1] - 2023-08-30

### Fixed

- Fixed url for slack notification

### Added

- Added flag public for npm publish

## [1.1.0] - 2023-08-30

### Removed

- Removed pkg helpers

## [1.0.2] - 2023-08-30

### Fixed

- Fixed step for npm publish script

## [1.0.1] - 2023-08-30

### Fixed

- Fixed npm publish script

## [1.0.0] - 2023-08-30

### Added

- Added setup repo
- Added method userInfoEvent
- Added method customEvent
