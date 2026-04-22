## 1. Preparación y Seguridad

- [x] 1.1 Crear backup del branch actual (`git stash` o crear branch `backup-pre-refactor`)
- [x] 1.2 Verificar que `.env` tiene todas las variables necesarias para desarrollo local
- [x] 1.3 Eliminar credenciales hardcodeadas de `src/db.ts` (quitar valores por defecto de user/password/database)
- [x] 1.4 Verificar que `npm run lint` pasa antes de empezar (baseline)

## 2. Compartir Tipos entre Frontend y Backend

- [x] 2.1 Crear `src/types/shared.ts` con interfaces `Lead` y `DiagnosticRequest`
- [x] 2.2 Actualizar `src/types.ts` para re-exportar o extender desde `shared.ts`
- [x] 2.3 Actualizar `server.ts` para importar `DiagnosticRequest` y `Lead` desde `./src/types/shared`
- [x] 2.4 Tipar `lead` en `App.tsx` como `Lead | null` en vez de `any`
- [x] 2.5 Tipar `lead` en `Results.tsx` como `Lead` en vez de `any`
- [x] 2.6 Verificar que no hay errores de TypeScript (`npm run lint`)

## 3. Centralizar Lógica de Niveles

- [x] 3.1 Crear `src/levels.ts` con objeto `USER_LEVELS` (mapeo de nivel a nombre/icono)
- [x] 3.2 Actualizar `Results.tsx` para importar `USER_LEVELS` desde `levels.ts`
- [x] 3.3 Actualizar `server.ts` para importar `USER_LEVELS` desde `./src/levels`
- [x] 3.4 Eliminar `getDimensionLevel` de `generateReportPDF.ts` y usar `getMaturityLevel` desde `utils.ts`
- [x] 3.5 Eliminar `getUserLevelLabel` de `server.ts` y usar `USER_LEVELS`
- [x] 3.6 Verificar que PDF y emails generan los mismos labels que antes

## 4. Eliminar Código Muerto del Frontend

- [x] 4.1 Eliminar `useDebouncedSessionSave` de `sessionStorage.ts`
- [x] 4.2 Eliminar `getCurrentDimension` de `App.tsx`
- [x] 4.3 Eliminar `getModuleProgress` de `App.tsx`
- [x] 4.4 Revisar y eliminar imports sin usar en todos los componentes (`Results.tsx`, `App.tsx`, etc.)
- [x] 4.5 Verificar que `npm run lint` sigue pasando

## 5. Eliminar Firebase y Dependencias Sin Uso

- [x] 5.1 Eliminar archivo `src/firebase.ts`
- [x] 5.2 Eliminar archivo `firebase-applet-config.json`
- [x] 5.3 Eliminar archivo `firebase-blueprint.json`
- [x] 5.4 Eliminar archivo `firestore.rules`
- [x] 5.5 Remover `firebase` de `dependencies` en `package.json`
- [x] 5.6 Remover `html2canvas` de `dependencies` en `package.json`
- [x] 5.7 Remover `@google/genai` de `dependencies` en `package.json`
- [x] 5.8 Ejecutar `npm install` para actualizar `package-lock.json`
- [x] 5.9 Verificar build (`npm run build`) sin errores

## 6. Verificación Final

- [x] 6.1 Ejecutar `npm run lint` y confirmar 0 errores
- [x] 6.2 Ejecutar `npm run build` y confirmar build exitoso
- [x] 6.3 Revisar visualmente que no hay imports rotos ni archivos huérfanos
- [x] 6.4 Verificar flujo completo: landing → welcome → questionnaire → leadform → results → PDF
- [x] 6.5 Confirmar que el endpoint `/api/diagnostic` funciona correctamente
- [x] 6.6 Revisar que `README.md` refleja el estado actual (sin Firebase)
