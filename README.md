# @janiscommerce/app-analytics

![janis-logo](brand-logo.png)

Firebase Analytics tracking for Janis React Native apps.

## Requirements

- `@react-native-firebase/app` and `@react-native-firebase/analytics` installed and configured
- `@janiscommerce/app-crashlytics` installed (used for internal error reporting in production)

See [Firebase setup](#firebase-setup) for Android/iOS configuration.

## Installation

```sh
npm install @janiscommerce/app-analytics
```

## Usage

### 1. Create an instance

```js
import Analytics from '@janiscommerce/app-analytics'

const analytics = new Analytics({ appVersion: '1.0.0' })
```

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `appVersion` | `string` | Yes | App version string |
| `isDebugMode` | `boolean` | No | When `true`, events are sent even in dev environment |

### 2. Register user identity at login

Call `setSession()` once after the user logs in. It fetches the user from the OAuth token and registers identity in Firebase via `setUserId` and `setUserProperties`.

```js
await analytics.setSession()
```

### 3. Send events

```js
// Log an action
await analytics.sendAction('button_press', 'Home')
await analytics.sendAction('button_press', 'Home', { itemId: '123' })

// Log a custom event
await analytics.sendCustomEvent('order_created', { orderId: '123' })

// Log a screen view
await analytics.sendScreenTracking('Home', 'HomeScreen')
```

### 4. Update user properties after login

Use `setUserProperties` to register or update dynamic user attributes after login (e.g. when a warehouse operator selects a depot).

```js
await analytics.setUserProperties({ warehouseId: 'WH-001' })
await analytics.setUserProperties({ language: 'es-AR' })
```

### 5. Clear user identity at logout

Call `clearSession()` when the user logs out. It clears user identity from Firebase and nullifies all registered user properties, including any extras set via `setUserProperties`.

```js
await analytics.clearSession()
```

---

## API

### `new Analytics({ appVersion, isDebugMode })`

Creates a new Analytics instance. Throws if `appVersion` is not provided or is not a string.

### `setSession()`

Fetches user info from the OAuth token and registers identity in Firebase:
- Calls `analytics().setUserId(sub)` with the token's `sub` field
- Calls `analytics().setUserProperties({ userEmail, client, language, userProfile })` with the token's fields

Required token fields: `sub`, `email`, `tcode`. Optional: `locale`, `profileName`.

Must be called once at login before sending events.

### `clearSession()`

Clears user identity from Firebase and resets session state:
- Calls `analytics().setUserId(null)`
- Nullifies all user properties registered during the session (both from `setSession()` and `setUserProperties()`)
- Resets session state while preserving `appVersion` and `isDebugMode`

Must be called at logout.

### `setUserProperties(properties)`

Updates one or more Firebase user properties. Accepts a non-empty object of key/value pairs.

```js
await analytics.setUserProperties({ warehouseId: 'WH-001', zone: 'north' })
```

Properties registered via this method are automatically cleared on `clearSession()`.

### `sendAction(actionName, screenName[, params])`

Logs a Firebase `action` event.

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `actionName` | `string` | Yes | Name of the action (formatted to lowercase with underscores) |
| `screenName` | `string` | No | Screen where the action was triggered |
| `params` | `object` | No | Extra params to include in the event |

Returns `true` on success, `false` on error, `null` if session not ready or dev environment.

### `sendCustomEvent(eventName[, params])`

Logs a custom Firebase event.

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `eventName` | `string` | Yes | Name of the event |
| `params` | `object` | No | Sent as individual Firebase event params |

Returns `true` on success, `false` on error, `null` if session not ready or dev environment.

### `sendScreenTracking(screenName[, screenClass])`

Logs a Firebase screen view event.

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `screenName` | `string` | Yes | Name of the screen the user is viewing |
| `screenClass` | `string` | No | Class associated with the screen |

Returns `true` on success, `false` on error, `null` if session not ready or dev environment.

---

## Base event params

Every event automatically includes:

| Param | Source |
| --- | --- |
| `appVersion` | Constructor param |
| `deviceId` | `@janiscommerce/app-device-info` |
| `device` | `@janiscommerce/app-device-info` |
| `osVersion` | `@janiscommerce/app-device-info` |
| `connection` | `@janiscommerce/app-device-info` (fetched fresh per event) |

User identity fields (`userEmail`, `client`, `language`, `userProfile`) are registered as Firebase user properties via `setSession()` — they do not travel as event params.

---

## Firebase setup

### Android

Add the Google Services plugin to `android/build.gradle`:

```groovy
dependencies {
  classpath 'com.google.gms:google-services:4.3.15'
}
```

Add to `android/app/build.gradle`:

```groovy
plugins {
  id("com.google.gms.google-services")
}

dependencies {
  implementation platform('com.google.firebase:firebase-bom:32.2.2')
  implementation 'com.google.firebase:firebase-analytics'
}
```

Clean the project:

```sh
cd android && ./gradlew clean && cd ..
```

---

## Documentation

- [Migration to v4](docs/migration-to-v4.md) — breaking changes and migration guide from v3 to v4
- [Enable Firebase DebugView](docs/enableDebugView.md) — how to enable real-time event debugging in Firebase console
- [Recommended Events](docs/recommendedEvents.md) — Google Analytics recommended events reference
