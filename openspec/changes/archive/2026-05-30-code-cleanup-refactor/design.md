## Context

DIGITAL-H es una aplicación React + TypeScript + Vite con backend Express + MySQL que ejecuta un cuestionario de madurez digital. El codebase tiene ~15 archivos fuente y acumula deuda técnica por iteraciones rápidas sin limpieza. No existe arquitectura de specs previa.

**Estado actual:**
- Firebase importado pero nunca utilizado (todo el backend usa MySQL)
- Lógica de niveles de madurez duplicada en 3 lugares (utils.ts, generateReportPDF.ts, server.ts)
- Credenciales de base de datos hardcodeadas en db.ts como fallback
- Tipado `any` en props críticas (`lead` en App.tsx y Results.tsx)
- Hook `useDebouncedSessionSave` exportado pero nunca consumido
- Funciones `getCurrentDimension` y `getModuleProgress` definidas pero no utilizadas

**Restricciones:**
- La app debe seguir funcionando igual para el usuario final
- El endpoint `/api/diagnostic` mantiene su contrato JSON
- No se agregan nuevas dependencias
- MySQL en Hostinger continúa como base de datos principal

## Goals / Non-Goals

**Goals:**
- Eliminar todo código y dependencias sin uso
- Centralizar lógica duplicada en un único source of truth
- Eliminar credenciales hardcodeadas
- Tipar correctamente todas las props y estados
- Compartir tipos entre frontend (src/) y backend (server.ts)

**Non-Goals:**
- No cambiar comportamiento funcional visible para el usuario
- No modificar el diseño UI/UX
- No agregar nuevas features
- No migrar base de datos
- No implementar tests automatizados (fuera de scope)

## Decisions

### 1. Unificar lógica de niveles en `src/utils.ts`
- **Decisión**: `getMaturityLevel` en `utils.ts` es el source of truth. `getDimensionLevel` en `generateReportPDF.ts` se elimina y usa `getMaturityLevel`.
- **Rationale**: `utils.ts` ya es un módulo compartido, evita crear nuevo archivo.
- **Alternativa considerada**: Crear `src/shared/levels.ts` — rechazada para minimizar cambios de estructura.

### 2. Unificar labels de usuario
- **Decisión**: Crear un módulo `src/levels.ts` (o similar) con un objeto `USER_LEVELS` que importen tanto `Results.tsx` como `server.ts`.
- **Rationale**: `server.ts` necesita este dato para emails. `Results.tsx` lo usa para UI.
- **Alternativa considerada**: Duplicar en ambos — rechazada por violar DRY.

### 3. Compartir tipos entre frontend y backend
- **Decisión**: Crear `src/types/shared.ts` con `Lead` y `DiagnosticRequest`, importado tanto por componentes como por `server.ts`.
- **Rationale**: Elimina `any` y garantiza consistencia. `server.ts` ya importa desde `./src/db`.
- **Alternativa considerada**: Duplicar tipos — rechazada.

### 4. Eliminar Firebase sin reemplazo
- **Decisión**: Remover completamente Firebase. Si en el futuro se necesita, se reinstala.
- **Rationale**: No se usa en ningún componente ni endpoint. Mantenerlo genera confusión y aumenta bundle size.
- **Alternativa considerada**: Dejar comentado — rechazada, el versionado git preserva historia.

### 5. Manejo de credenciales en db.ts
- **Decisión**: Eliminar valores por defecto en `db.ts`. La app debe fallar claramente si faltan variables de entorno.
- **Rationale**: Valores por defecto con credenciales reales son un riesgo de seguridad. En producción (Hostinger) las env vars están configuradas.
- **Alternativa considerada**: Usar `dotenv` con `.env.example` — ya existe, pero los fallbacks deben irse.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| [Risk] Al eliminar `firebase` del package.json, si alguien corre `npm install` en una rama antigua, puede tener conflictos | [Mitigation] Documentar en README que Firebase fue removido intencionalmente |
| [Risk] Tipar `lead` como `Lead \| null` en vez de `any` puede exponer bugs ocultos donde se accede a props sin validar | [Mitigation] Revisar manualmente todos los usos de `lead` antes de cambiar el tipo |
| [Risk] Eliminar credenciales por defecto en db.ts puede romper entornos locales que dependían de ellos | [Mitigation] Agregar instrucciones claras en README sobre configurar `.env` |
| [Risk] Al compartir tipos entre frontend y backend, cambios en shared.ts afectan ambos lados | [Mitigation] Este es el comportamiento deseado — consistencia garantizada |

## Migration Plan

1. **Paso 1**: Crear `src/types/shared.ts` con tipos compartidos
2. **Paso 2**: Actualizar imports en componentes y server.ts
3. **Paso 3**: Centralizar lógica de niveles
4. **Paso 4**: Eliminar código muerto y archivos Firebase
5. **Paso 5**: Limpiar package.json
6. **Paso 6**: Verificar build (`npm run lint`) y funcionamiento manual

**Rollback**: `git revert` del commit de refactorización.

## Open Questions

1. ¿`html2canvas` se usa en algún lugar no auditado? (No se encontró uso en la exploración)
2. ¿`@google/genai` tiene algún uso planeado o es residuo? 
3. ¿Existen otros archivos `.json` de Firebase que deban eliminarse?
