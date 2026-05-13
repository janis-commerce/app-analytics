## Why

El paquete `@janiscommerce/app-analytics` envía datos de identidad del usuario (`userEmail`, `userId`, `client`, `language`, `userProfile`) como parámetros en cada `logEvent()` de Firebase. GA4 con scope de evento no consolida usuarios — cada evento puede contar como un usuario distinto, inflando `totalUsers` y haciendo los reportes inútiles para tomar decisiones de producto.

## What Changes

- **BREAKING**: `initialize()` se renombra a `setSession()` — el consumidor debe llamarlo explícitamente al login
- **BREAKING**: se agrega `clearSession()` — el consumidor debe llamarlo en logout
- **BREAKING**: se elimina `sendUserInfo()` y `lib/userInfoEvent.js` — su propósito queda cubierto por `setSession()`
- `setSession()` obtiene el token via `getUserInfo()`, llama `analytics().setUserId(sub)` y `analytics().setUserProperties({ userEmail, client, language, profile: profileName })` de `@react-native-firebase/analytics` una sola vez por sesión; ya no guarda campos de usuario en `eventData`; no tiene lógica de "ya inicializado" — es responsabilidad del consumidor llamarlo en el momento correcto (login)
- Los campos `userEmail`, `userId`, `client`, `language`, `userProfile` dejan de viajar como parámetros en cada evento de Firebase
- Se introduce método privado `#getBaseEventParams()` que obtiene los datos mínimos para eventos (`connection`) antes de cada envío
- `formatBasicData()` se renombra a `getEventBaseData()` y se reduce a retornar solo `appVersion`, `connection`, `deviceId`
- `requiredInitialData` se elimina — las keys base quedan inline en `getEventBaseData()`; `includesAllProperties` se elimina
- `lib/analytics.js` se consolida en `lib/index.js` (se elimina el archivo intermedio)
- `lib/userInfoEvent.js` se elimina
- El nombre interno `userProfile` se mantiene; en Firebase se registra como user property `profile` (proveniente de `profileName` del token)

## Capabilities

### New Capabilities
- `session-identity`: registrar la identidad del usuario en Firebase una sola vez por sesión via `setSession()`, y limpiarla en logout via `clearSession()`

### Modified Capabilities
- `event-params`: los eventos de Firebase dejan de incluir campos de identidad de usuario; solo llevan `appVersion`, `connection`, `deviceId`

## Impact

- `lib/analytics.js` → consolidado en `lib/index.js`; se elimina `lib/userInfoEvent.js`
- `lib/utils/index.js`: `formatBasicData()` → `getEventBaseData()`; solo retorna `appVersion`, `connection`, `deviceId`
- `lib/constant/requiredInitialData.js` se elimina; `includesAllProperties` en utils se elimina
- API pública: `initialize()` → `setSession()`, se agrega `clearSession()`, se elimina `sendUserInfo()`; `sendAction`, `sendCustomEvent`, `sendScreenTracking` no cambian firma
- Consumidores (app-picking, app-delivery, app-wms): `setSession()` en login, `clearSession()` en logout, eliminar `sendUserInfo()` del `Home`
- Tests: deben actualizarse para reflejar la nueva API y que los eventos ya no incluyen campos de usuario
- Versión del paquete: major bump (tres breaking changes en API pública)
- Dependencia: `@react-native-firebase/analytics` ya es dependencia; se usan `setUserId` y `setUserProperties`
