## Why

El codebase de DIGITAL-H acumula código muerto, duplicación de lógica, credenciales hardcodeadas y tipado inconsistente que incrementan la deuda técnica y el riesgo de seguridad. Esta refactorización elimina dependencias sin uso, centraliza lógica repetida y fortalece la calidad del código antes de nuevas funcionalidades.

## What Changes

- **Eliminar Firebase completo**: Remover `src/firebase.ts`, `firebase-applet-config.json`, `firebase-blueprint.json`, `firestore.rules` y la dependencia `firebase` del package.json (**BREAKING** para cualquier feature futura de Firebase).
- **Remover código muerto**: Eliminar `useDebouncedSessionSave` de `sessionStorage.ts`, funciones `getCurrentDimension` y `getModuleProgress` de `App.tsx`.
- **Eliminar dependencias sin uso**: Remover `html2canvas`, `@google/genai` y otras dependencias no utilizadas del package.json.
- **Unificar lógica duplicada**: Consolidar `getMaturityLevel` (utils.ts) con `getDimensionLevel` (generateReportPDF.ts) en un único módulo compartido. Unificar `USER_LEVELS` (Results.tsx) con `getUserLevelLabel` (server.ts).
- **Eliminar credenciales hardcodeadas**: Remover valores por defecto de usuario/contraseña/base de datos de `src/db.ts`.
- **Mejorar tipado**: Reemplazar `any` en props de `App.tsx` (`lead`) y `Results.tsx` por la interfaz `Lead` definida en `types.ts`.
- **Compartir tipos entre frontend y backend**: Extraer interfaces comunes (`Lead`, `DiagnosticRequest`) a un módulo compartido.

## Capabilities

### New Capabilities
<!-- No new business capabilities. This is a pure technical refactoring. -->

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- **Frontend**: `src/App.tsx`, `src/components/Results.tsx`, `src/sessionStorage.ts`, `src/utils.ts`, `src/generateReportPDF.ts`, `src/types.ts`
- **Backend**: `server.ts`, `src/db.ts`
- **Configuración**: `package.json`, `tsconfig.json` (si es necesario para paths compartidos)
- **Archivos eliminados**: `src/firebase.ts`, `firebase-applet-config.json`, `firebase-blueprint.json`, `firestore.rules`
- **APIs**: Ninguna API externa cambia. El endpoint `/api/diagnostic` mantiene su contrato.
- **Dependencias**: `-firebase`, `-html2canvas`, `-@google/genai`
