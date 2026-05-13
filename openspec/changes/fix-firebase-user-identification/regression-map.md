# Regression Map — fix-firebase-user-identification

Este documento mapea el comportamiento de cada método en la versión productiva actual (master) contra el comportamiento en la versión nueva, para facilitar la detección de regresiones.

---

## Versión productiva (master)

### Constructor

```js
new Analytics({ appVersion, isDebugMode, ...otherParams })
```

- Acepta cualquier objeto como params (incluyendo campos de usuario como `userEmail`, `userId`, etc.)
- Guarda todo en `this.eventData` via `validObjectWithValues(params)`
- Si no se pasa nada, `this.eventData = {}`
- `this.isDebugMode` se guarda como propiedad directa de la instancia

### `initialize(appVersion)`

Llamado internamente por cada método de envío antes de cada evento.

1. Llama `getNetworkState()` y guarda `connection` en `this.eventData`
2. Si `this.eventData` ya tiene los 8 campos requeridos (`appVersion`, `userEmail`, `userId`, `client`, `language`, `deviceId`, `connection`, `userProfile`), retorna `this.eventData` sin llamar `getUserInfo()`
3. Si faltan campos, llama `getUserInfo()` y extrae: `email → userEmail`, `sub → userId`, `tcode → client`, `locale → language`, `profileName → userProfile`
4. Guarda todos esos campos en `this.eventData` junto con `appVersion` y `deviceId`
5. Si `getUserInfo()` falla: guarda solo `{ appVersion }` en `this.eventData` y retorna ese objeto
6. Los campos de usuario viajan en `this.eventData` y se adjuntan como params en cada `logEvent()`

**Firebase API usada:** ninguna — solo prepara datos localmente.

**Campos requeridos para que los eventos se envíen** (`requiredInitialData`):
```
appVersion, userEmail, userId, client, language, deviceId, connection, userProfile
```

---

### `sendUserInfo()`

1. Llama `initialize()` internamente
2. Si faltan campos requeridos → retorna `null` sin enviar nada
3. Llama `getDeviceScreenMeasurements()`, `getApplicationName()`, `getDeviceModel()`, `getOSVersion()`
4. Arma `userInfoData` con todos los campos de usuario + device
5. Si `isDebugMode || !isDevEnv()` → llama `userInfoEvent(userInfoData)`

**Firebase API usada:** `analytics().logEvent('user_info', { ...params })`

**Params que viajan en el evento:** `appName`, `appVersion`, `device`, `osVersion`, `userEmail`, `userId`, `client`, `language`, `connection`, `deviceId`, `userProfile`, `screenSize`

---

### `sendAction(actionName, screenName, params)`

1. Llama `initialize()` internamente
2. Si faltan campos requeridos → retorna `null`
3. Arma `actionData` con: `screenName`, params extra, `formatBasicData(userInfo)` (los 8 campos de usuario), `actionName`
4. Si `isDebugMode || !isDevEnv()` → llama `actionEvent(actionData)`

**Firebase API usada:** `analytics().logEvent('action', { ...params })`

**Params que viajan en el evento:** `actionName`, `screenName`, `userEmail`, `userId`, `client`, `appVersion`, `language`, `connection`, `deviceId`, `userProfile`, + params extra

---

### `sendCustomEvent(customName, params, requiredParams)`

1. Llama `initialize()` internamente
2. Si faltan campos requeridos → retorna `null`
3. Arma `customData` con: params extra + `formatBasicData(userInfo)` (los 8 campos de usuario)
4. Si `isDebugMode || !isDevEnv()` → llama `customEvent(customName, customData, requiredParams)`

**Firebase API usada:** `analytics().logEvent(customName, { ...params })`

**Params que viajan en el evento:** `userEmail`, `userId`, `client`, `appVersion`, `language`, `connection`, `deviceId`, `userProfile`, + params extra

---

### `sendScreenTracking(screenName, screenClass)`

1. Llama `initialize()` internamente
2. Si faltan campos requeridos → retorna `null`
3. Si `isDebugMode || !isDevEnv()` → llama `screenViewEvent(screenName, screenClass, userInfo)`

**Firebase API usada:** `analytics().logScreenView({ screen_name, screen_class, ...params })`

**Params que viajan en el evento:** `userEmail`, `userId`, `client`, `appVersion`, `language`, `connection`, `deviceId`, `userProfile`

---

### Ciclo de vida en master

```
new Analytics({ appVersion, userEmail, userId, ... })
  → cada sendX() llama initialize() que llama getUserInfo() si faltan campos
  → los 8 campos de usuario viajan en cada logEvent() como event params
  → GA4 los recibe como parámetros de evento (scope: event, no consolida usuarios)
```

---

## Versión nueva (esta rama)

### Constructor

```js
new Analytics({ appVersion, isDebugMode })
```

- Solo acepta `appVersion` e `isDebugMode`
- **Lanza `Error('appVersion is required')`** si no se provee `appVersion`
- Inicializa `this.session = { isReady: false, canTrackEvents: false, appVersion, isDebugMode }`
- Los campos de usuario ya NO se guardan en la instancia

---

### `setSession()` _(nuevo, reemplaza `initialize()` para identidad de usuario)_

Debe llamarse **una vez al login**.

1. Llama `getUserInfo()` via `promiseWrapper`
2. Si falla → `canTrackEvents` permanece `false`, llama `showErrorInDebug(error)`; todos los eventos posteriores retornan `null`
3. Si tiene éxito:
   - Llama `analytics().setUserId(sub)` — registra el userId en Firebase a nivel de sesión
   - Llama `analytics().setUserProperties({ userEmail, client, language, profile })` — registra propiedades de usuario a nivel de sesión
   - Valida que el token tenga los campos requeridos via `validateData(userInfo, ['sub', 'email', 'tcode', 'locale', 'profileName'])` — lanza error si alguno falta o está vacío
   - Campos opcionales ausentes del token se omiten en `setUserProperties` (no se envían como `null`)
   - Guarda en `this.session`: `{ isReady: true, canTrackEvents: true, isDebugMode, appVersion, deviceId, appName, device, osVersion }`

**Firebase API usada:** `analytics().setUserId(sub)` + `analytics().setUserProperties({ ... })`

**Mapeo OAuth → Firebase:**
| Campo token | Firebase API | Nombre en Firebase |
|---|---|---|
| `sub` | `setUserId()` | (user ID) |
| `email` | `setUserProperties` | `userEmail` |
| `tcode` | `setUserProperties` | `client` |
| `locale` | `setUserProperties` | `language` |
| `profileName` | `setUserProperties` | `profile` |

---

### `clearSession()` _(nuevo, debe llamarse en logout)_

1. Llama `analytics().setUserId(null)`
2. Llama `analytics().setUserProperties({ userEmail: null, client: null, language: null, profile: null })`
3. Resetea `this.session = { isReady: false, canTrackEvents: false }`
4. Si ocurre un error → llama `showErrorInDebug(error)`

**Firebase API usada:** `analytics().setUserId(null)` + `analytics().setUserProperties({ ... })`

---

### `#getBaseEventParams()` _(privado, nuevo)_

Llamado internamente antes de cada evento.

1. Si `!this.session.isReady` → lanza error, entra en catch, setea `canTrackEvents = false` y retorna `null`
2. Llama `getNetworkState()` para obtener `connection` fresco
3. Setea `this.session.canTrackEvents = true` (recuperación automática tras fallo de red)
4. Lee `appVersion`, `deviceId`, `appName`, `device`, `osVersion` de `this.session`
5. Retorna `{ connection, appVersion, deviceId, appName, device, osVersion }`
6. Si `getNetworkState()` falla → catch setea `canTrackEvents = false` y retorna `null`

**Firebase API usada:** ninguna.

---

### `sendAction(actionName, screenName, params)`

1. Llama `#getBaseEventParams()` — si `!isReady`, retorna `null` y baja `canTrackEvents`
2. Si `!#canSendEvent` (`!isReady || !canTrackEvents`) → retorna `null`
3. Si `!isDebugMode && isDevEnv()` → retorna `null`
4. Llama `actionEvent(actionData)` y retorna su resultado

**Firebase API usada:** `analytics().logEvent('action', { ...params })`

**Params que viajan en el evento:** `actionName`, `screenName`, `appVersion`, `connection`, `deviceId`, `appName`, `device`, `osVersion`, + params extra

**Ya NO viajan:** `userEmail`, `userId`, `client`, `language`, `userProfile`

---

### `sendCustomEvent(customName, params, requiredParams)`

1. Llama `#getBaseEventParams()` — si `!isReady`, retorna `null` y baja `canTrackEvents`
2. Si `!#canSendEvent` → retorna `null`
3. Si `!isDebugMode && isDevEnv()` → retorna `null`
4. Llama `customEvent(customName, customData, requiredParams)` y retorna su resultado

**Firebase API usada:** `analytics().logEvent(customName, { ...params })`

**Params que viajan en el evento:** `appVersion`, `connection`, `deviceId`, `appName`, `device`, `osVersion`, + params extra

**Ya NO viajan:** `userEmail`, `userId`, `client`, `language`, `userProfile`

---

### `sendScreenTracking(screenName, screenClass)`

1. Llama `#getBaseEventParams()` — si `!isReady`, retorna `null` y baja `canTrackEvents`
2. Si `!#canSendEvent` → retorna `null`
3. Si `!isDebugMode && isDevEnv()` → retorna `null`
4. Llama `screenViewEvent(screenName, screenClass, baseParams)` y retorna su resultado

**Firebase API usada:** `analytics().logScreenView({ screen_name, screen_class, ...params })`

**Params que viajan en el evento:** `appVersion`, `connection`, `deviceId`, `appName`, `device`, `osVersion`

**Ya NO viajan:** `userEmail`, `userId`, `client`, `language`, `userProfile`

---

### Ciclo de vida en versión nueva

```
new Analytics({ appVersion })
  → en login: setSession() — llama setUserId + setUserProperties una vez
  → cada sendX() verifica canTrackEvents, luego llama #getBaseEventParams()
  → solo appVersion, connection, deviceId, appName, device, osVersion viajan en cada logEvent()
  → GA4 consolida usuarios via setUserId (scope: user, consolida correctamente)
  → en logout: clearSession() — limpia userId y userProperties en Firebase
```

---

## Diferencias clave para validar regresiones

| Aspecto | Master | Nueva versión |
|---|---|---|
| Identidad de usuario en Firebase | Viaja en cada `logEvent()` como event param | Se registra una vez via `setUserId` / `setUserProperties` |
| `userEmail`, `userId`, `client`, `language`, `userProfile` en eventos | ✅ Presentes en cada evento | ❌ Eliminados de los event params |
| Inicialización | `initialize()` lazy en cada evento | `setSession()` explícito al login |
| Gate para envío de eventos | `includesAllProperties(userInfo)` — valida 8 campos | `#canSendEvent` — getter privado: `isReady && canTrackEvents` |
| Evento `user_info` | `sendUserInfo()` lo envía | Eliminado — `setSession()` cubre su propósito |
| `appName`, `device`, `osVersion` en eventos | Solo en `sendUserInfo()` | En todos los eventos via `#getBaseEventParams()` |
| Constructor sin `appVersion` | No lanza error (instancia vacía) | **Lanza `Error('appVersion is required')`** |
| `isDebugMode` | Propiedad directa de instancia | Campo de `this.session` |
| Retorno de métodos de envío | `undefined` (sin `return` explícito) | Retorna el resultado del evento o `null` |
