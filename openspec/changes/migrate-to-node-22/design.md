## Context

La librería se publica como código ES2018 ya escrito directamente en `lib/` (sin build step antes de publish — `files: ["lib/"]`). El tooling solo se usa para tests, lint y generación de docs. Por eso la migración no tiene impacto runtime en consumidores, pero sí necesita un toolchain coherente con Node 22 para no romper CI.

Los 6 archivos en `test/` son pruebas de funciones JS puras con mocks de Jest — sin render de componentes React, sin snapshots, sin uso de `@testing-library/react-native` (auditado: 0 imports).

## Goals / Non-Goals

**Goals:**
- Soportar Node 22 LTS en desarrollo local y CI.
- Eliminar todas las devDependencies deprecadas.
- Alinear devDeps de React/RN con las apps consumidoras (React 19.1.0 + RN 0.80.2).
- Mantener coverage al 100% (umbral configurado en `jest.config.json`).
- Mantener compatibilidad de instalación para consumidores en Node 18 (sin `engines`).

**Non-Goals:**
- Migrar a ESLint 9 (incompatible con `eslint-config-airbnb@19` + eslintrc legacy; es un proyecto aparte).
- Migrar a flat config de ESLint.
- Cambiar código en `lib/`.
- Modificar `peerDependencies` o `dependencies`.
- Agregar TypeScript, monorepo, o cualquier otra modernización fuera del bump.

## Decisions

**D1. ESLint 8 (no 9).** Airbnb config no soporta ESLint 9 sin migrar a flat config. ESLint 8 cubre Node 22 sin problemas.

**D2. `react-native` dev = 0.80.2 (exact, igual que las apps).** El peerDep declara `>=0.71.5 <0.82.0`. Se elige alinear con la versión que usan las apps consumidoras (commit `a245571`). Esto asegura que el toolchain corre la misma combinación React/RN que producción. `@react-native/babel-preset` alineado en `^0.80.0`.

**D3. React `^19.1.0` (mayor fijado, igual que las apps).** PeerDep acepta `>=17 <20`. Las apps consumidoras corren 19.1.0; usamos `^19.1.0` para recibir minors/patches de React 19 automáticamente sin riesgo de saltar a React 20. `react-test-renderer` también en `^19.1.0` (peer estricto de React).

**D4. Eliminar `@testing-library/react-native`.** 0 imports verificados en todo el proyecto. Deuda muerta — se elimina. Si se necesita en el futuro para tests de UI, se instala fresco con la versión que corresponda.

**D5. Sin `engines.node`.** Apps en Node 18 deben poder instalar la librería sin warnings de npm.

**D6. Husky v9 setup desde cero.** No hay `.husky/` ni sección `husky` activa en `package.json` hoy. Setup mínimo con `.husky/pre-commit` corriendo `lint-staged`.

**D7. Jest 29 (no 30).** Jest 30 no tiene matriz de compat clara con `@react-native/babel-preset@0.80` + React 19. Jest 29 es la versión estable en el ecosistema RN 0.80.

**D8. Prettier 3 con commit separado.** El upgrade reformatea archivos (paréntesis en arrows, trailing commas). El reformat va en un commit dedicado para mantener el diff de migración legible.

**D9. Release como patch (3.0.1).** Ningún cambio observable para consumidores; SemVer permite patch.

## Risks / Trade-offs

| # | Riesgo | Mitigación |
|---|---|---|
| 1 | Prettier 3 genera diff grande en `lib/` | Commit separado `chore: prettier 3 reformat`; revisar tarball con `npm pack --dry-run` |
| 2 | Airbnb 19 introduce reglas más estrictas que antes pasaban | Deshabilitar puntualmente en `.eslintrc.js` con justificación; no bajar a airbnb 18 |
| 3 | `@babel/eslint-parser` más estricto que `babel-eslint` | `ecmaVersion: 2020` + `requireConfigFile: false` cubren los casos detectados en `lib/` |
| 4 | `react-test-renderer@19` está marcado como deprecado por el equipo de React | Sigue funcional e instalable; los tests no lo usan directamente. Fallback: `react@18` + `react-test-renderer@18` |
| 5 | Coverage 100% frágil ante cambios de babel preset (instrumentación distinta de optional chaining) | Inspeccionar `coverage/index.html` y ajustar tests; NO bajar el umbral |
| 6 | `react-native@0.80.2` puede fallar `npm install` en Apple Silicon por scripts nativos (codegen) | `npm install --ignore-scripts` — la lib no compila nativo, solo resuelve imports en tests |
| 7 | React 19 cambia internals de reconciler; snapshots existentes pueden diferir | No hay snapshots en los tests actuales (usan `expect()` directos); riesgo nulo verificado |
