## 1. Eliminar userInfoEvent

- [x] 1.1 Eliminar método `sendUserInfo()` de la clase
- [x] 1.2 Eliminar import de `userInfoEvent` en `lib/analytics.js`
- [x] 1.3 Eliminar `lib/userInfoEvent.js`

## 2. Eliminar requiredInitialData

- [x] 2.1 Eliminar `lib/constant/requiredInitialData.js`
- [x] 2.2 Eliminar `includesAllProperties` y `updateRequiredParams` de `lib/utils/index.js`

## 3. Consolidar analytics.js en index.js

- [x] 3.1 Mover el contenido de `lib/analytics.js` a `lib/index.js`
- [x] 3.2 Eliminar `lib/analytics.js`

## 4. Inicialización de session en el constructor

- [x] 4.1 Agregar `this.session = { canTrackEvents: false, appVersion, isDebugMode, userProperties: {} }` en el constructor
- [x] 4.2 Validar que `appVersion` es requerido en el constructor — lanzar error si no se provee

## 5. Implementar clearSession()

- [x] 5.1 Crear método `clearSession()` que llame `analytics().setUserId(null)`
- [x] 5.2 Nullificar dinámicamente todas las user properties registradas en `this.session.userProperties` — no llamar `setUserProperties` si no hay keys
- [x] 5.3 Resetear `this.session` al shape del constructor preservando `appVersion` e `isDebugMode`

## 6. Implementar #getBaseEventParams()

- [x] 6.1 Crear método privado `#getBaseEventParams()` que llame `getNetworkState()`
- [x] 6.2 Retornar `{ connection, appVersion, deviceId }` combinando red actual con `this.session`

## 7. Implementar setSession()

- [x] 7.1 Crear método `setSession()` que llame `getUserInfo()`
- [x] 7.2 Llamar `analytics().setUserId(sub)` con el campo `sub` del token
- [x] 7.3 Llamar `analytics().setUserProperties({ userEmail, client, language, profile: profileName })`
- [x] 7.4 Guardar `{ appVersion, deviceId, device, osVersion }` en `this.session`
- [x] 7.5 Setear `this.session.canTrackEvents = true` al completar exitosamente
- [x] 7.6 Manejar error: si `getUserInfo()` falla, `canTrackEvents` permanece `false` y se llama `showErrorInDebug`

## 8. Actualizar métodos de envío de eventos

- [x] 8.1 Reemplazar lógica de `initialize()` en `sendAction()` por verificación de `this.session.canTrackEvents` y uso de `#getBaseEventParams()`
- [x] 8.2 Reemplazar lógica de `initialize()` en `sendCustomEvent()` por verificación de `this.session.canTrackEvents` y uso de `#getBaseEventParams()`
- [x] 8.3 Reemplazar lógica de `initialize()` en `sendScreenTracking()` por verificación de `this.session.canTrackEvents` y uso de `#getBaseEventParams()`

## 9. Limpiar utils

- [x] 9.1 Eliminar `includesAllProperties` y `updateRequiredParams` de `lib/utils/index.js`
- [x] 9.2 Actualizar todas las referencias a `includesAllProperties` y `updateRequiredParams` en el codebase
- [x] 9.3 Eliminar `formatBasicData()` — los datos base se arman inline en `#getBaseEventParams()`
- [x] 9.4 Renombrar `validObjectWithValues` → `normalizeParams` en `lib/utils/index.js`
- [x] 9.5 Renombrar `validateRequiredStringParams` → `validateData` y sus argumentos `params`/`extraRequiredParams` → `data`/`requiredKeys`
- [x] 9.6 Eliminar `splitRequiredAndRemainingParams` — ya no se usa en ningún archivo
- [x] 9.7 Eliminar `formatValue` — reemplazada por `formatActionName` inline en `actionEvent.js`
- [x] 9.8 Eliminar `lib/utils/decorationText.js` — código muerto
- [x] 9.9 Mover `promiseWrapper` a `@janiscommerce/apps-helpers` — agregar como peerDependency y devDependency
- [x] 9.10 Actualizar todas las referencias en el codebase

## 11. Refactorizar eventos

- [x] 11.1 Mover try/catch de `actionEvent` a `sendAction` — `actionEvent` lanza, `sendAction` maneja el error
- [x] 11.2 Mover try/catch de `customEvent` a `sendCustomEvent` — `customEvent` lanza, `sendCustomEvent` maneja el error
- [x] 11.3 Mover try/catch de `screenViewEvent` a `sendScreenTracking` — `screenViewEvent` lanza, `sendScreenTracking` maneja el error
- [x] 11.4 Cambiar firma de `sendCustomEvent` a objeto `{eventName, params, extraParams}` — más legible con múltiples argumentos opcionales
- [x] 11.5 Cambiar firma de `customEvent` — tercer argumento pasa a ser `extraParams` (objeto) en vez de array de requeridos; se serializa bajo `dataEvent`
- [x] 11.6 Todos los `sendX` retornan `true` en éxito y `false` en error

## 10. Tests

- [x] 10.1 Actualizar tests del constructor para reflejar `this.session`
- [x] 10.2 Agregar tests para `setSession()` con token válido
- [x] 10.3 Agregar tests para `setSession()` cuando `getUserInfo()` falla
- [x] 10.4 Agregar tests para `setSession()` llamado múltiples veces
- [x] 10.5 Agregar tests para `clearSession()`
- [x] 10.6 Agregar tests para `#getBaseEventParams()`
- [x] 10.7 Agregar tests que verifiquen que los eventos retornan `null` cuando `canTrackEvents` es `false`
- [x] 10.8 Verificar que ningún evento incluye `userEmail`, `userId`, `client`, `language` ni `userProfile` como params
- [x] 10.9 Actualizar tests de `sendAction()`, `sendCustomEvent()`, `sendScreenTracking()`
- [x] 10.10 Actualizar tests de `validateData` y `normalizeParams` en utils
- [x] 10.11 Eliminar tests de `sendUserInfo()` y `userInfoEvent`

## 12. Post-beta.1: mejoras iterativas (beta.2 y beta.3)

- [x] 12.1 Agregar prefix `[GA4]` a todos los logs de error del paquete
- [x] 12.2 Eliminar `appName` de los event params — Firebase expone app identity nativamente
- [x] 12.3 Hacer `locale` y `profileName` opcionales en `setSession()` — solo `sub`, `email`, `tcode` son requeridos
- [x] 12.4 Agregar método `setUserProperties(properties)` para registrar/actualizar user properties dinámicas post-login
- [x] 12.5 Integrar `@janiscommerce/app-crashlytics` como peerDependency obligatoria para reportar errores internos en producción — renombrar `showErrorInDebug` → `reportError`
- [x] 12.6 `clearSession()` nullifica dinámicamente todas las user properties (incluye las de `setUserProperties()`)
- [x] 12.7 `clearSession()` preserva `appVersion` e `isDebugMode` del constructor en `this.session`
- [x] 12.8 `setSession()` y `setUserProperties()` acumulan keys registradas en `this.session.userProperties`
