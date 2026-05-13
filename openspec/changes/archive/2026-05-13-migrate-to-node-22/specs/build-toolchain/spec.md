## ADDED Requirements

### Requirement: Node.js Runtime
El proyecto SHALL usar Node.js 22 LTS para desarrollo local y CI.

#### Scenario: Pinning local
- **WHEN** un desarrollador clona el repo y corre `nvm use`
- **THEN** debe activarse Node 22 según `.nvmrc`

#### Scenario: CI matrix
- **WHEN** un workflow de GitHub Actions corre
- **THEN** debe usar `node-version: 22.x` (o `'22'`) en `actions/setup-node@v4`

#### Scenario: Sin engines forzados
- **WHEN** una app consumidora instala la librería con Node 18
- **THEN** npm NO debe emitir warning de `engines` ni bloquear la instalación

### Requirement: Linting
El proyecto SHALL usar ESLint 8 con `@babel/eslint-parser` y configuración estilo Airbnb.

#### Scenario: Lint passes
- **WHEN** se ejecuta `npm run lint`
- **THEN** debe terminar con exit code 0 y 0 errores

#### Scenario: Parser moderno
- **WHEN** ESLint encuentra optional chaining (`a?.b`) en `lib/`
- **THEN** debe parsearlo correctamente sin error de sintaxis

### Requirement: Formatting
El proyecto SHALL usar Prettier 3 con la configuración del proyecto.

#### Scenario: Format check
- **WHEN** se ejecuta `npm run lint` (que incluye prettier vía plugin)
- **THEN** ningún archivo debe reportar problemas de formato

### Requirement: Test Runner
El proyecto SHALL usar Jest 29 alineado con `babel-jest@29` y un coverage del 100%.

#### Scenario: Coverage threshold
- **WHEN** se ejecuta `npm run test:coverage`
- **THEN** branches, functions, lines y statements deben ser 100%

#### Scenario: Babel transform
- **WHEN** Jest transforma archivos `.js`/`.ts`/`.tsx`
- **THEN** debe usar `babel-jest` con `@react-native/babel-preset` activo

### Requirement: Docs Build
El proyecto SHALL poder generar el README desde JSDoc.

#### Scenario: build-docs
- **WHEN** se ejecuta `npm run build-docs`
- **THEN** `README.md` se regenera sin error desde `lib/*.js`

### Requirement: Git Hooks
El proyecto SHALL usar Husky 9 con `lint-staged` 15 para correr lint/format pre-commit.

#### Scenario: Pre-commit
- **WHEN** un desarrollador commitea archivos `.js`/`.jsx` staged
- **THEN** `lint-staged` debe ejecutar `eslint --fix` y `prettier --write` sobre esos archivos

### Requirement: CI Actions Modernizadas
Los workflows SHALL usar `actions/setup-node@v4` y `actions/checkout@v4` como mínimo.

#### Scenario: Setup-node version
- **WHEN** se inspecciona cualquier workflow en `.github/workflows/`
- **THEN** no debe haber referencias a `actions/setup-node@v1` ni `actions/checkout@v2` ni `actions/checkout@v3`

### Requirement: DevDependencies Limpias
El proyecto SHALL NO depender de paquetes deprecados.

#### Scenario: package.json check
- **WHEN** se inspeccionan las `devDependencies`
- **THEN** no deben estar presentes: `babel-eslint`, `metro-react-native-babel-preset`, `husky@4`, `@babel/plugin-proposal-class-properties`, `@babel/plugin-proposal-object-rest-spread`, `babel-loader`, `@testing-library/react-native`
