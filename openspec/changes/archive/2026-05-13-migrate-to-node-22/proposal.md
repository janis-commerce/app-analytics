## Why

El proyecto corre hoy con Node 18 local y una mezcla inconsistente de Node 16/18 en CI. Node 18 está próximo a EOL y Node 22 es la LTS activa.

Varias devDependencies son obstáculos para subir a Node 22:

- `babel-eslint@10` está **deprecado** (reemplazado por `@babel/eslint-parser`).
- `eslint@7.14.0` (pinned) es EOL, sin soporte oficial para Node 22.
- `husky@4` está deprecado; API cambió radicalmente en v7+.
- `metro-react-native-babel-preset@0.66` está **deprecado** (reemplazado por `@react-native/babel-preset`).
- `babel-jest@26` está desalineado con `jest@28`.
- `react-native@0.67` y `react@17` (devDeps) están desfasados de la realidad de las apps consumidoras, que ya corren **React 19.1.0 + React Native 0.80.2**.

Además, la lib declara `@testing-library/react-native` como devDep pero **ningún test la importa** (auditoría: 0 referencias en `test/`, `lib/`, `setupTest/`, `__mocks__/`).

CI suma deuda: workflows con `actions/setup-node@v1` y `actions/checkout@v2` (deprecados por GitHub).

La librería publica código ES2018 ya escrito en `lib/` sin build step (`files: ["lib/"]`), así que el riesgo de runtime para apps consumidoras es bajo — el riesgo real está en el toolchain de desarrollo y CI.

## What Changes

- Bump de Node 18 → 22 en `.nvmrc` y en los 5 workflows de GitHub Actions.
- Modernización de actions: `setup-node@v1` → `@v4`, `checkout@v2/v3` → `@v4`.
- **Alineación con apps consumidoras**:
  - `react` (dev): `^17.0.2` → `^19.1.0`
  - `react-test-renderer`: eliminado (0 imports verificados)
  - `react-native` (dev): `^0.67.5` → `0.80.2` (exact)
  - `@react-native/babel-preset` (nuevo): `^0.80.0`
- Reemplazo de devDeps deprecadas:
  - `babel-eslint` → `@babel/eslint-parser@^7.25.1`
  - `metro-react-native-babel-preset` → `@react-native/babel-preset@^0.80.0`
  - `husky@4` → `husky@^9.1.6`
  - `lint-staged@10` → `lint-staged@^15.2.10`
- Actualizaciones mayores:
  - `eslint@7` → `^8.57.1` (no a 9: airbnb config + eslintrc legacy no lo soporta)
  - `eslint-config-airbnb@18` → `^19.0.4` + plugins alineados
  - `prettier@2` → `^3.3.3`
  - `jest@28` → `^29.7.0` con `babel-jest@^29.7.0`
- Eliminaciones (deuda muerta o cubierta por presets):
  - `@testing-library/react-native` (0 imports verificados)
  - `babel-loader` (no hay webpack)
  - `@babel/plugin-proposal-class-properties` (cubierto por preset-env)
  - `@babel/plugin-proposal-object-rest-spread` (idem)
  - `@react-native-community/eslint-config` (no aparece en `extends`)
- Ajustes de config:
  - `.eslintrc.js`: parser → `@babel/eslint-parser`, `ecmaVersion: 2020`, `requireConfigFile: false`
  - `babel.config.js`: preset → `module:@react-native/babel-preset`
  - `.prettierrc.js`: `jsxBracketSameLine` → `bracketSameLine`
- Setup mínimo de Husky v9: `.husky/pre-commit` con `lint-staged` + `"prepare": "husky"` en `package.json`.
- **NO** se agrega `engines.node` en `package.json` (consumidores en Node 18 deben seguir instalando sin warnings).
- **NO** se modifican `dependencies` ni `peerDependencies` (impacto cero en apps).

## Capabilities

### New Capabilities
- `build-toolchain`: contrato del entorno de desarrollo y CI de la librería — versión de Node, linter, formatter, test runner, build de docs, hooks de git, matriz de CI.

### Modified Capabilities

*(ninguna — la migración no altera comportamiento público de la librería)*

## Impact

**Afectado:**
- `package.json` — bloque `devDependencies`, `scripts.prepare`, bloque `lint-staged` nuevo.
- `.nvmrc` — bump a `v22`.
- 5 workflows en `.github/workflows/` — versiones de Node y de actions.
- Configs: `.eslintrc.js`, `babel.config.js`, `.prettierrc.js`.
- Nuevo archivo `.husky/pre-commit`.

**No afectado:**
- `lib/` (código publicado): sin cambios funcionales; posible reformat estético de Prettier 3 (commit separado).
- API pública de la librería.
- `dependencies` y `peerDependencies` → apps consumidoras no requieren actualizar nada.

**Sistemas externos:**
- CI (GitHub Actions): primer push debe validar pipeline verde en Node 22 antes de mergear.
- npm publish: release como **patch** (`3.0.0` → `3.0.1`); verificar con `npm pack --dry-run` que el tarball queda funcionalmente equivalente.
- Apps consumidoras: ninguna acción requerida; pueden seguir en Node 18.
