## ADDED Requirements

### Requirement: appVersion es requerido en el constructor
El constructor SHALL lanzar un error si `appVersion` no es provisto o no es un string.

#### Scenario: constructor sin appVersion o con tipo inválido
- **WHEN** el consumidor instancia `new Analytics()`, `new Analytics({})`, o pasa un valor que no sea string (`null`, `undefined`, `''`, `123`, `{}`)
- **THEN** el constructor lanza `Error('appVersion is required')`

#### Scenario: constructor con appVersion válido
- **WHEN** el consumidor instancia `new Analytics({ appVersion: '1.0.0' })`
- **THEN** `this.session.appVersion` es `'1.0.0'`

### Requirement: setSession registra la identidad del usuario en Firebase
Cuando el consumidor llama `setSession()`, el sistema SHALL obtener los datos del usuario desde el token OAuth via `getUserInfo()`, validar que los campos requeridos del token estén presentes via `validateData`, llamar `analytics().setUserId(sub)` con el campo `sub` del token, y llamar `analytics().setUserProperties({ userEmail, client, language, profile })` con los campos correspondientes del token. El sistema SHALL guardar `{ appVersion, deviceId, device, osVersion, isReady: true, canTrackEvents: true, userProperties }` en `this.session`. Si `getUserInfo()` falla o la validación del token falla, `isReady` y `canTrackEvents` permanecen `false` y los eventos posteriores no se enviarán.

#### Scenario: setSession con token válido
- **WHEN** el consumidor llama `setSession()` en una instancia creada con `new Analytics({ appVersion })`
- **THEN** el sistema valida los campos del token con `validateData(userInfo, ['sub', 'email', 'tcode'])`
- **THEN** el sistema llama `analytics().setUserId(sub)` con el `sub` del token
- **THEN** el sistema llama `analytics().setUserProperties({ userEmail, client, language, profile })` con los valores del token
- **THEN** el sistema guarda `{ isReady: true, canTrackEvents: true, appVersion, deviceId, device, osVersion, userProperties }` en `this.session`

#### Scenario: setSession cuando getUserInfo falla
- **WHEN** el consumidor llama `setSession()` y `getUserInfo()` lanza un error
- **THEN** el sistema NO llama `setUserId` ni `setUserProperties`
- **THEN** `this.session.isReady` permanece `false`
- **THEN** `this.session.canTrackEvents` permanece `false`
- **THEN** el sistema registra el error en consola si el entorno no es producción

#### Scenario: setSession con token incompleto
- **WHEN** el consumidor llama `setSession()` y `getUserInfo()` retorna un token sin alguno de los campos requeridos (`sub`, `email`, `tcode`)
- **THEN** `validateData` lanza un error
- **THEN** el sistema NO llama `setUserId` ni `setUserProperties`
- **THEN** `this.session.isReady` permanece `false`
- **THEN** `this.session.canTrackEvents` permanece `false`

#### Scenario: eventos posteriores a setSession fallido
- **WHEN** `setSession()` falló y el consumidor llama cualquier método de envío de evento
- **THEN** el método retorna `null` sin enviar nada a Firebase

#### Scenario: setSession llamado múltiples veces con el mismo usuario
- **WHEN** el consumidor llama `setSession()` más de una vez con el mismo usuario autenticado
- **THEN** Firebase sobreescribe los valores con los mismos datos sin efectos adversos

### Requirement: clearSession limpia la identidad del usuario en Firebase
Cuando el consumidor llama `clearSession()`, el sistema SHALL llamar `analytics().setUserId(null)` y nullificar dinámicamente todas las user properties registradas durante la sesión (las de `setSession()` y las extras de `setUserProperties()`). El sistema SHALL resetear `this.session` al shape del constructor, preservando `appVersion` e `isDebugMode`. Si ocurre un error, SHALL reportarlo vía `reportError`.

#### Scenario: clearSession sin user properties registradas
- **WHEN** el consumidor llama `clearSession()` sin haber llamado `setSession()` ni `setUserProperties()`
- **THEN** el sistema llama `analytics().setUserId(null)`
- **THEN** el sistema NO llama `analytics().setUserProperties` (no hay keys que limpiar)
- **THEN** `this.session.isReady` es `false`
- **THEN** `this.session.canTrackEvents` es `false`
- **THEN** `this.session.appVersion` e `this.session.isDebugMode` se preservan

#### Scenario: clearSession después de setSession
- **WHEN** el consumidor llamó `setSession()` y luego llama `clearSession()`
- **THEN** el sistema llama `analytics().setUserId(null)`
- **THEN** el sistema llama `analytics().setUserProperties` con las mismas keys de `setSession()` nullificadas
- **THEN** `this.session.isReady` es `false`
- **THEN** `this.session.canTrackEvents` es `false`

#### Scenario: clearSession limpia props dinámicas registradas via setUserProperties
- **WHEN** el consumidor llamó `setUserProperties({ warehouseId: 'WH-001' })` y luego llama `clearSession()`
- **THEN** el sistema llama `analytics().setUserProperties({ warehouseId: null })`
- **THEN** `this.session.userProperties` queda `{}`

#### Scenario: clearSession preserva appVersion e isDebugMode
- **WHEN** el consumidor llama `clearSession()` en una instancia creada con `new Analytics({ appVersion: '2.5.0', isDebugMode: true })`
- **THEN** `this.session.appVersion` sigue siendo `'2.5.0'`
- **THEN** `this.session.isDebugMode` sigue siendo `true`

#### Scenario: eventos posteriores a clearSession
- **WHEN** el consumidor llama `clearSession()` y luego intenta enviar un evento
- **THEN** el método de envío retorna `null` sin enviar nada a Firebase

### Requirement: Mapeo de campos OAuth a Firebase
El sistema SHALL mapear los campos del token OAuth a Firebase de la siguiente forma:

| Campo token OAuth | API Firebase | Nombre en Firebase | Requerido |
|---|---|---|---|
| `sub` | `setUserId()` | — | Sí |
| `email` | `setUserProperties` | `userEmail` | Sí |
| `tcode` | `setUserProperties` | `client` | Sí |
| `locale` | `setUserProperties` | `language` | No |
| `profileName` | `setUserProperties` | `profile` | No |

#### Scenario: Mapeo correcto de campos del token
- **WHEN** `getUserInfo()` retorna un token con `sub`, `email`, `tcode`, `locale`, `profileName`
- **THEN** `setUserId` recibe el valor de `sub`
- **THEN** `setUserProperties` recibe `{ userEmail: email, client: tcode, language: locale, profile: profileName }`

#### Scenario: Token con campos requeridos faltantes
- **WHEN** `getUserInfo()` retorna un token sin alguno de los campos requeridos (`sub`, `email`, `tcode`)
- **THEN** `validateData` lanza un error
- **THEN** el sistema NO llama `setUserId` ni `setUserProperties`
- **THEN** `this.session.isReady` permanece `false`
