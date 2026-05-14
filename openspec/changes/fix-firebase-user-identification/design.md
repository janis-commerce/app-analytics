## Context

El paquete expone una clase `Analytics` desde `lib/analytics.js` (re-exportada por `lib/index.js`). Hoy el método `initialize()` cumple dos responsabilidades:

1. Obtener datos del usuario desde el token OAuth (`getUserInfo()`) y guardarlos en `this.eventData`
2. Obtener el estado de red (`getNetworkState()`)

Ambos datos se pasan luego a cada evento vía `formatBasicData()`, que arma un objeto plano con `userEmail`, `userId`, `client`, `language`, `userProfile`, `appVersion`, `connection`, `deviceId`. Todos viajan como params en cada `logEvent()`.

El problema: GA4 con scope de evento no consolida usuarios. Cada evento puede contar como usuario distinto porque `userId` viaja como event param, no como identificador de sesión.

La solución es usar las APIs de sesión de Firebase: `analytics().setUserId()` y `analytics().setUserProperties()`, que asocian la identidad al dispositivo/sesión y se aplican automáticamente a todos los eventos posteriores.

## Goals / Non-Goals

**Goals:**
- Separar la identificación de sesión del usuario (Firebase) de los datos básicos de evento
- Exponer `setSession()` y `clearSession()` como API pública explícita para que el consumidor controle el ciclo login/logout
- Eliminar campos de usuario de los event params
- Eliminar `sendUserInfo()` y `lib/userInfoEvent.js` — su propósito queda cubierto por `setSession()`
- Consolidar `lib/analytics.js` en `lib/index.js`

**Non-Goals:**
- Modificar la firma de los métodos de envío de eventos (`sendAction`, `sendCustomEvent`, `sendScreenTracking`)
- Agregar guarda de "ya inicializado" — es responsabilidad del consumidor
- Cambiar el comportamiento de `isDebugMode`

## Decisions

### 1. Separar `initialize()` en `setSession()` + `#getBaseEventParams()`

`initialize()` hoy mezcla obtención de identidad de usuario con obtención de datos de red. Con el nuevo modelo:

- **`setSession()`** (público): llama `getUserInfo()`, luego `analytics().setUserId(sub)` y `analytics().setUserProperties({ userEmail, client, language, profile: profileName })`. Guarda `{ appVersion, deviceId, appName, device, osVersion }` en `this.session` — `appVersion` del constructor, el resto de `@janiscommerce/app-device-info` — y setea `this.session.canTrackEvents = true`. Si falla, `canTrackEvents` permanece `false`.
- **`#getBaseEventParams()`** (privado): llama `getNetworkState()` y retorna `{ connection, appVersion, deviceId }` combinando la red actual con `this.session`. Se ejecuta antes de cada evento.
- **`this.session`**: objeto de instancia con `{ appVersion, deviceId, appName, device, osVersion, isReady, canTrackEvents, isDebugMode }`. `isReady` empieza en `false` y solo pasa a `true` cuando `setSession()` completa exitosamente — es la guarda de autenticación. `canTrackEvents` refleja el estado de red y puede oscilar entre eventos — si `getNetworkState()` falla se pone en `false`, si tiene éxito vuelve a `true`. El getter privado `#canSendEvent` combina ambas flags: `isReady && canTrackEvents`. Todos los métodos de envío verifican `#canSendEvent` antes de proceder — si retorna `false` retornan `null` sin enviar nada.

**Alternativa descartada:** mantener `initialize()` lazy (como hoy, con el check `includesAllProperties`). Se descarta porque oculta el momento real del seteo y hace que Firebase reciba el `setUserId` en el primer evento en lugar de al login.

### 2. Eliminar `formatBasicData()` / `getEventBaseData()`

Con el nuevo modelo los datos base se arman inline en `#getBaseEventParams()`. No se justifica una función util separada.

### 3. Eliminar `requiredInitialData` e `includesAllProperties`

Con `this.session.isReady` y `this.session.canTrackEvents` como fuente de verdad para saber si se puede trackear, `requiredInitialData` e `includesAllProperties` pierden su propósito y se eliminan.

### 4. Consolidar `lib/analytics.js` → `lib/index.js`

`lib/index.js` hoy solo re-exporta `lib/analytics.js`. Con este cambio la clase pasa directamente a `lib/index.js`, eliminando un nivel de indirección innecesario.

### 5. `clearSession()` limpia estado en Firebase y en la instancia

Llama `analytics().setUserId(null)` y `analytics().setUserProperties({ userEmail: null, client: null, language: null, profile: null })`. Además resetea `this.session` a `{ isReady: false, canTrackEvents: false }` para que un eventual `setSession()` posterior funcione correctamente.

### 6. Try/catch en `sendX`, no en los eventos internos

`actionEvent`, `customEvent` y `screenViewEvent` son funciones internas que lanzan si algo falla. El manejo de error (try/catch + `showErrorInDebug`) vive en `sendAction`, `sendCustomEvent` y `sendScreenTracking`. Esto simplifica las funciones internas y centraliza la política de error en la clase.

### 7. Firma de `sendCustomEvent` como objeto

`sendCustomEvent` recibe `{eventName, params, extraParams}` en lugar de tres argumentos posicionales. Con múltiples argumentos opcionales, el objeto es más legible y menos propenso a errores de orden.

### 8. `extraParams` en `customEvent` → `dataEvent`

El tercer argumento de `customEvent` pasó de ser un array de keys requeridas a un objeto `extraParams`. Los campos en `extraParams` se serializan bajo la key `dataEvent` como JSON string, para no superar el límite de 25 params por evento de Firebase. Los campos en `params` van directo al evento como params individuales.

### 10. Mapeo de campos OAuth → Firebase

| Campo token OAuth | User property en Firebase |
|---|---|
| `sub` | `setUserId(sub)` |
| `email` | `userEmail` |
| `tcode` | `client` |
| `locale` | `language` |
| `profileName` | `profile` |

## Risks / Trade-offs

- **El consumidor debe adaptar su integración** → Es un breaking change mayor. Si el consumidor no llama `setSession()` al login, los eventos se envían sin identidad de usuario en Firebase. Mitigación: documentar claramente en README y publicar major version.
- **`clearSession()` no es llamado automáticamente en logout** → Si el consumidor olvida llamarlo, el siguiente usuario de la sesión hereda la identidad del anterior. Mitigación: documentar el contrato explícitamente.
- **`setSession()` puede llamarse múltiples veces** → Firebase sobreescribe con el último valor; no genera duplicados ni efectos adversos. No requiere guarda.

## Migration Plan

1. Publicar nueva major version del paquete
2. Actualizar README con el nuevo ciclo de vida: `setSession()` en login, `clearSession()` en logout
3. Los consumidores (app-picking, app-delivery, app-wms) deben:
   - Reemplazar llamadas a `initialize()` por `setSession()` en el flujo de login
   - Agregar `clearSession()` en sus flujos de logout
   - Eliminar la llamada a `sendUserInfo()` en `Home`
