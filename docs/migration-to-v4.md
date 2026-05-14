# Migration to v4

Version 4 changes how user identity is registered in Firebase Analytics. User fields (`userEmail`, `userId`, `client`, `language`, `userProfile`) no longer travel as params in every event — they are now registered once per session using Firebase's session APIs.

This requires a few changes in how you integrate the package.

---

## Why

GA4 with event-scoped dimensions does not consolidate users. When `userId` and other identity fields travel as event params, each event can be counted as a distinct user — inflating `totalUsers` and making audience reports unreliable.

The fix is to use Firebase's session APIs: `analytics().setUserId()` and `analytics().setUserProperties()`. These associate identity with the device/session and are automatically applied to all subsequent events, so they only need to be called once at login.

---

## Breaking changes

### 1. Replace `sendUserInfo()` with `setSession()`

`sendUserInfo()` has been removed. Call `setSession()` once after the user logs in instead.

**Before:**
```js
// screens/Home/index.js
analytics.sendUserInfo()
```

**After:**
```js
// screens/Home/index.js
await analytics.setSession()
```

`setSession()` fetches the user from the OAuth token and registers their identity in Firebase via `setUserId` and `setUserProperties`.

---

### 2. Call `clearSession()` on logout

There is a new method `clearSession()` that clears the user identity from Firebase. You must call it when the user logs out to prevent the next user from inheriting the previous user's identity.

```js
// logout flow
await analytics.clearSession()
```

---

### 3. `sendCustomEvent()` has a new signature

`sendCustomEvent` now receives a single object instead of positional arguments. The third argument changed from an array of required param keys to an optional `extraParams` object.

**Before:**
```js
await analytics.sendCustomEvent('order_created', { orderId: '123' }, ['orderId'])
```

**After:**
```js
await analytics.sendCustomEvent({
  eventName: 'order_created',
  params: { orderId: '123' },
  extraParams: { note: 'fragile' }, // optional
})
```

`params` are sent as individual Firebase event params. `extraParams` are serialized as a JSON string under the key `dataEvent`, to stay within Firebase's 25-param limit.

---

### 4. User fields no longer appear in events

`userEmail`, `userId`, `client`, `language` and `userProfile` are no longer included as params in `sendAction`, `sendCustomEvent` or `sendScreenTracking` events.

If you have dashboards, BigQuery exports or GA4 audiences that read these fields from event params, update them to use Firebase user properties or user-scoped dimensions instead.

---

### 5. `appName` no longer travels in events

`appName` is no longer included as a param in `sendAction`, `sendCustomEvent` or `sendScreenTracking`. Firebase Analytics already knows the app identity natively, so this param was redundant.

If you have dashboards, BigQuery queries or GA4 audiences that filter by `event_params.appName`, update them to use `app_info.id` (BigQuery) or the GA4 "App name" dimension instead.

---

## Migration checklist

- [ ] Replace `analytics.sendUserInfo()` with `await analytics.setSession()` in the login flow
- [ ] Add `await analytics.clearSession()` in the logout flow
- [ ] Update `sendCustomEvent` calls to use the new object signature `{ eventName, params, extraParams }`
- [ ] Update GA4/BigQuery dashboards that filter by `event_params.appName` to use `app_info.id` or the GA4 "App name" dimension instead
