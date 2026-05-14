## MODIFIED Requirements

### Requirement: Datos base que viajan en cada evento
Los eventos de Firebase SHALL incluir `appVersion`, `deviceId`, `connection`, `device` y `osVersion` como datos base. Los campos de identidad de usuario (`userEmail`, `userId`, `client`, `language`, `userProfile`) NO deben incluirse como parámetros de evento — son registrados una sola vez por sesión vía `setSession()`.

#### Scenario: Evento enviado con datos base correctos
- **WHEN** el consumidor llama cualquier método de envío (`sendAction`, `sendCustomEvent`, `sendScreenTracking`)
- **THEN** el evento incluye `appVersion`, `deviceId`, `connection`, `device`, `osVersion`
- **THEN** el evento NO incluye `userEmail`, `userId`, `client`, `language` ni `userProfile`

#### Scenario: connection se obtiene fresco en cada evento
- **WHEN** el consumidor envía un evento
- **THEN** el sistema llama `getNetworkState()` para obtener el valor actual de `connection`
- **THEN** el valor de `connection` en el evento refleja el estado de red en el momento del envío

#### Scenario: evento bloqueado si la sesión no está lista
- **WHEN** `this.session.isReady` es `false` o `this.session.canTrackEvents` es `false` y el consumidor llama cualquier método de envío
- **THEN** el método retorna `null` sin llamar `logEvent` ni `logScreenView`

#### Scenario: recuperación automática de red
- **WHEN** un evento falla porque `getNetworkState()` lanzó un error, dejando `canTrackEvents` en `false`
- **THEN** el siguiente evento llama `#getBaseEventParams()` que intenta `getNetworkState()` nuevamente
- **THEN** si `getNetworkState()` tiene éxito, `canTrackEvents` vuelve a `true` y el evento se envía

## REMOVED Requirements

### Requirement: Datos de usuario como event params
**Reason**: Los campos `userEmail`, `userId`, `client`, `language` y `userProfile` inflaban el conteo de usuarios en GA4 al viajar como event params con scope de evento. Ahora se registran como user properties de sesión vía `setSession()`.
**Migration**: Llamar `setSession()` al login para registrar la identidad del usuario en Firebase. Los eventos existentes que dependan de estos campos en sus params dejarán de recibirlos.

### Requirement: sendUserInfo
**Reason**: `sendUserInfo()` enviaba datos de usuario + dispositivo como evento custom `user_info`. Con el nuevo modelo la identidad del usuario queda registrada en Firebase vía `setSession()`, haciendo este evento redundante.
**Migration**: Reemplazar la llamada a `sendUserInfo()` por `setSession()` en el flujo de login. Eliminar la llamada a `sendUserInfo()` del componente `Home` en los consumidores.

### Requirement: sendCustomEvent con firma posicional
**Reason**: La firma `sendCustomEvent(eventName, params, requiredParams)` fue reemplazada por un objeto `{ eventName, params, extraParams }` para mayor claridad con múltiples argumentos opcionales. `extraParams` se serializa bajo la key `dataEvent` como JSON string para no superar el límite de 25 params por evento de Firebase.
**Migration**: Reemplazar `sendCustomEvent('event', data, ['key'])` por `sendCustomEvent({ eventName: 'event', params: data, extraParams: { key: value } })`.
