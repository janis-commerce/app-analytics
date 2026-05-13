## 1. OpenSpec scaffolding

- [x] 1.1 Crear `openspec/changes/migrate-to-node-22/proposal.md`
- [x] 1.2 Crear `openspec/changes/migrate-to-node-22/design.md`
- [x] 1.3 Crear `openspec/changes/migrate-to-node-22/tasks.md`
- [x] 1.4 Crear `openspec/changes/migrate-to-node-22/specs/build-toolchain/spec.md`
- [x] 1.5 Validar con `openspec validate migrate-to-node-22`

## 2. Bump de Node + workflows

- [x] 2.1 Actualizar `.nvmrc` (`v18` → `v22`)
- [x] 2.2 Actualizar `.github/workflows/buid-status.yml` (Node + actions)
- [x] 2.3 Actualizar `.github/workflows/build-docs.yml`
- [x] 2.4 Actualizar `.github/workflows/coverage-status.yml`
- [x] 2.5 Actualizar `.github/workflows/npm-publish.yml`
- [x] 2.6 Actualizar `.github/workflows/npm-publish-beta.yml`
- [x] 2.7 Validar local: `nvm use 22 && npm ci && npm test`

## 3. Babel + Jest + RN devDeps

- [x] 3.1 Actualizar `@babel/core`, `@babel/preset-env`, `@babel/runtime`
- [x] 3.2 Reemplazar `metro-react-native-babel-preset` por `@react-native/babel-preset@^0.80.0`
- [x] 3.3 Actualizar `babel.config.js` (`module:metro-react-native-babel-preset` → `module:@react-native/babel-preset`)
- [x] 3.4 Eliminar `@babel/plugin-proposal-class-properties`, `@babel/plugin-proposal-object-rest-spread`, `babel-loader`
- [x] 3.5 Subir `jest` → `^29.7.0` y `babel-jest` → `^29.7.0`
- [x] 3.6 Subir `react` → `^19.1.0`, `react-native` → `0.80.2` (react-test-renderer eliminado, 0 imports)
- [x] 3.7 Eliminar `@testing-library/react-native`
- [x] 3.8 `npm run test:coverage` → 100/100/100/100 ✓

## 4. ESLint stack

- [x] 4.1 Subir `eslint` → `^8.57.1`
- [x] 4.2 Instalar `@babel/eslint-parser@^7.25.1`, eliminar `babel-eslint`
- [x] 4.3 Subir `eslint-config-airbnb` → `^19.0.4` y plugins: `import@^2.31.0`, `jsx-a11y@^6.10.2`, `react@^7.37.2`, `react-hooks@^4.6.2`
- [x] 4.4 Subir `eslint-config-prettier` → `^9.1.0`, `eslint-plugin-prettier` → `^5.2.1`
- [x] 4.5 Eliminar `@react-native-community/eslint-config`
- [x] 4.6 Actualizar `.eslintrc.js`: `parser: '@babel/eslint-parser'`, `ecmaVersion: 2020`, `requireConfigFile: false`, `babelOptions: { presets: ['@babel/preset-env'] }`
- [x] 4.7 `npm run lint` → 0 errores ✓

## 5. Prettier 3

- [x] 5.1 Subir `prettier` → `^3.3.3`
- [x] 5.2 Actualizar `.prettierrc.js`: `jsxBracketSameLine` → `bracketSameLine`
- [x] 5.3 Correr `npm run lint -- --fix` sin cambios adicionales ✓

## 6. Husky + lint-staged

- [x] 6.1 Quitar `husky@4`, instalar `husky@^9.1.6` y `lint-staged@^15.2.10`
- [x] 6.2 Agregar `"prepare": "husky"` en `scripts` de `package.json`
- [x] 6.3 Agregar bloque `"lint-staged": { "*.{js,jsx}": ["eslint --fix", "prettier --write"] }` en `package.json`
- [x] 6.4 Crear `.husky/pre-commit` con `npx lint-staged`
- [x] 6.5 Probado: husky corrió automáticamente en `npm install` ✓

## 7. Verificación end-to-end

- [x] 7.1 `rm -rf node_modules package-lock.json coverage`
- [x] 7.2 `nvm use 22 && node -v` → `v22.20.0` ✓
- [x] 7.3 `npm install` → 936 packages, 0 vulnerabilities ✓
- [x] 7.4 `npm run lint` → 0 errores ✓
- [x] 7.5 `npm run test:coverage` → 100/100/100/100, 60/60 tests ✓
- [x] 7.6 `npm run build-docs` → sin error ✓
- [x] 7.7 Smoke import → `"object"` ✓
- [x] 7.8 Validado con yalc en janis-picking-app ✓
- [x] 7.9 Mergeado a master, CI verde ✓

## 8. Cierre

- [x] 8.1 Bump versión a `3.1.0` en `package.json`
- [x] 8.2 CHANGELOG actualizado con entrada `3.1.0`
- [x] 8.3 Archivar change: `openspec archive migrate-to-node-22`
