## 1. OpenSpec scaffolding

- [x] 1.1 Crear `openspec/changes/migrate-to-node-22/proposal.md`
- [x] 1.2 Crear `openspec/changes/migrate-to-node-22/design.md`
- [x] 1.3 Crear `openspec/changes/migrate-to-node-22/tasks.md`
- [x] 1.4 Crear `openspec/changes/migrate-to-node-22/specs/build-toolchain/spec.md`
- [x] 1.5 Validar con `openspec validate migrate-to-node-22`

## 2. Bump de Node + workflows

- [ ] 2.1 Actualizar `.nvmrc` (`v18` → `v22`)
- [ ] 2.2 Actualizar `.github/workflows/buid-status.yml` (Node + actions)
- [ ] 2.3 Actualizar `.github/workflows/build-docs.yml`
- [ ] 2.4 Actualizar `.github/workflows/coverage-status.yml`
- [ ] 2.5 Actualizar `.github/workflows/npm-publish.yml`
- [ ] 2.6 Actualizar `.github/workflows/npm-publish-beta.yml`
- [ ] 2.7 Validar local: `nvm use 22 && npm ci && npm test`

## 3. Babel + Jest + RN devDeps

- [ ] 3.1 Actualizar `@babel/core`, `@babel/preset-env`, `@babel/runtime`
- [ ] 3.2 Reemplazar `metro-react-native-babel-preset` por `@react-native/babel-preset@^0.80.0`
- [ ] 3.3 Actualizar `babel.config.js` (`module:metro-react-native-babel-preset` → `module:@react-native/babel-preset`)
- [ ] 3.4 Eliminar `@babel/plugin-proposal-class-properties`, `@babel/plugin-proposal-object-rest-spread`, `babel-loader`
- [ ] 3.5 Subir `jest` → `^29.7.0` y `babel-jest` → `^29.7.0`
- [ ] 3.6 Subir `react` → `^19.1.0`, `react-test-renderer` → `^19.1.0`, `react-native` → `0.80.2`
- [ ] 3.7 Eliminar `@testing-library/react-native`
- [ ] 3.8 `npm run test:coverage` debe pasar al 100%

## 4. ESLint stack

- [ ] 4.1 Subir `eslint` → `^8.57.1`
- [ ] 4.2 Instalar `@babel/eslint-parser@^7.25.1`, eliminar `babel-eslint`
- [ ] 4.3 Subir `eslint-config-airbnb` → `^19.0.4` y plugins: `import@^2.31.0`, `jsx-a11y@^6.10.2`, `react@^7.37.2`, `react-hooks@^4.6.2`
- [ ] 4.4 Subir `eslint-config-prettier` → `^9.1.0`, `eslint-plugin-prettier` → `^5.2.1`
- [ ] 4.5 Eliminar `@react-native-community/eslint-config`
- [ ] 4.6 Actualizar `.eslintrc.js`: `parser: '@babel/eslint-parser'`, `ecmaVersion: 2020`, `requireConfigFile: false`, `babelOptions: { presets: ['@babel/preset-env'] }`
- [ ] 4.7 `npm run lint` debe pasar con 0 errores

## 5. Prettier 3

- [ ] 5.1 Subir `prettier` → `^3.3.3`
- [ ] 5.2 Actualizar `.prettierrc.js`: `jsxBracketSameLine` → `bracketSameLine`
- [ ] 5.3 Correr `npm run lint -- --fix` y hacer commit separado `chore: prettier 3 reformat`

## 6. Husky + lint-staged

- [ ] 6.1 Quitar `husky@4`, instalar `husky@^9.1.6` y `lint-staged@^15.2.10`
- [ ] 6.2 Agregar `"prepare": "husky"` en `scripts` de `package.json`
- [ ] 6.3 Agregar bloque `"lint-staged": { "*.{js,jsx}": ["eslint --fix", "prettier --write"] }` en `package.json`
- [ ] 6.4 Crear `.husky/pre-commit` con `npx lint-staged`
- [ ] 6.5 Probar con commit dummy

## 7. Verificación end-to-end

- [ ] 7.1 `rm -rf node_modules package-lock.json coverage`
- [ ] 7.2 `nvm use 22 && node -v` → `v22.x`
- [ ] 7.3 `npm install` sin errores ni warnings críticos
- [ ] 7.4 `npm run lint` → 0 errores
- [ ] 7.5 `npm run test:coverage` → 100/100/100/100
- [ ] 7.6 `npm run build-docs` regenera README sin error
- [ ] 7.7 Smoke import: `node -e "const A=require('./lib').default;const a=new A({appVersion:'1.0.0'});console.log(typeof a.eventData)"` → `"object"`
- [ ] 7.8 `npm pack --dry-run` y verificar que `lib/` queda funcionalmente equivalente
- [ ] 7.9 Push a branch y verificar 3 workflows de build en verde

## 8. Cierre

- [ ] 8.1 Bump versión a `3.0.1` en `package.json`
- [ ] 8.2 Crear PR
- [ ] 8.3 Una vez mergeado, archivar change: `openspec archive migrate-to-node-22`
