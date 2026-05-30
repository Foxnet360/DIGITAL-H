## Context

El diagnóstico DIGITAL-H es un lead magnet interactivo de Acrux Consultores que evalúa la madurez digital de empresas en 6 dimensiones (48 preguntas). Actualmente el flujo está roto en el código fuente: Landing → LeadForm (captura email antes de mostrar valor), lo que causa abandono masivo. La producción usa un flujo diferente (Landing → Welcome → Questionnaire → LeadForm@Q31 → Results) con backend PHP en Hostinger.

Este cambio implementa la arquitectura de alta conversión basada en psicología del Costo Hundido: el usuario debe invertir tiempo/esfuerzo antes de entregar sus datos, maximizando la sensación de "ya he llegado hasta aquí, no puedo abandonar ahora".

## Goals / Non-Goals

**Goals:**
- Mover la captura de email de inicio a post-pregunta 48 (final del cuestionario)
- Implementar indicadores de progreso que refuercen el Sunk Cost Fallacy
- Crear mensajes de urgencia en la página de resultados por nivel de madurez
- Reemplazar Calendly externo con calendario propio de agendamiento
- Eliminar backend Express y consolidar en PHP (usar Docker para local)
- Preparar campos/documentación para futura integración HubSpot

**Non-Goals:**
- No integrar HubSpot en este cambio (solo preparación)
- No modificar las 48 preguntas ni el algoritmo de cálculo IMD
- No cambiar el sistema de branding/visual de Acrux (ya está implementado)
- No implementar autenticación de usuarios

## Decisions

### 1. Flujo de navegación: Landing → Questionnaire → LeadForm@Q48 → Results
**Rationale:** La captura al inicio (como está en src/ actual) genera fricción máxima sin valor previo. La captura a mitad (Q31, como en prod) es mejor pero interrumpe el momentum. La captura al final (Q48) permite que el usuario invierta ~15 min antes de pedir datos, maximizando el Costo Hundido.

**Alternativa considerada:** Mantener Q31 (producción actual) con mejoras de micro-compromisos. Rechazada porque el impacto de mover a Q48 es mayor según benchmarks de conversión B2B.

### 2. Eliminación de Express, consolidación en PHP + Docker
**Rationale:** El backend Express (server.ts, src/db.ts) nunca fue deployado a producción. La producción usa PHP en Hostinger shared hosting. Mantener dos stacks genera confusión y deuda técnica. Docker permite replicar el entorno PHP+MySQL en local.

**Alternativa considerada:** Migrar producción a Express. Rechazada por costo y complejidad de cambiar infraestructura en Hostinger.

### 3. Calendario propio vs Calendly
**Rationale:** El usuario pidió "calendario propio". Se implementará un selector de fecha/hora simple guardado en MySQL, con notificación por email. Esto elimina dependencia de terceros y permite personalización completa.

**Alternativa considerada:** Mantener Calendly con embed inline. Rechazada por requisito explícito de calendario propio.

### 4. sessionStorage/localStorage para progreso
**Rationale:** Ya existe sessionStorage.ts con funciones saveSession/loadSession/clearSession. Se reutilizará y extenderá para guardar timestamp de inicio (para calcular tiempo invertido) y estado de respuestas.

### 5. Componente LeadForm como pantalla completa (no modal)
**Rationale:** Aunque un modal inline podría ser más suave, una pantalla completa post-Q48 permite mostrar más contexto de inversión acumulada (tiempo, progreso, badges) sin limitaciones de espacio. Se evaluará si hacerlo modal en iteración futura.

## Risks / Trade-offs

**[Riesgo]** Algunos usuarios pueden abandonar en Q48 sin dar email, perdiendo el lead por completo.
→ **Mitigación:** Implementar recuperación de sesión agresiva. Si el usuario cierra la pestaña en Q48, al volver mostrar: "Estabas a 1 paso de tu reporte. Solo necesitamos tu email para enviarlo." Guardar answers en localStorage indefinidamente (no solo durante sesión).

**[Riesgo]** El cambio de flujo puede afectar métricas existentes (eventos gtag) y hacer incomparables los datos históricos.
→ **Mitigación:** Mantener nombres de eventos existentes pero añadir propiedad `flow_version` en todos los eventos. Documentar el cambio en analytics.

**[Riesgo]** El calendario propio puede tener bugs de disponibilidad (doble-booking) si no se implementa bloqueo adecuado.
→ **Mitigación:** Usar transacciones SQL (INSERT con verificación de disponibilidad). En MVP, no permitir agendar con menos de 24h de anticipación para dar margen de confirmación manual.

**[Riesgo]** Docker en local puede ser barrera para desarrolladores no familiarizados.
→ **Mitigación:** Documentación clara con comandos copy-paste. Mantener compatibilidad con `npm run dev` para frontend puro (sin backend PHP).

## Migration Plan

1. **Deploy Fase 0 (Fundación)**: Fix flujo roto + eliminar Express. Deploy inmediato para estabilizar.
2. **Deploy Fase 1 (Micro-compromisos)**: Añadir progreso visual. Deploy cuando QA pase.
3. **Deploy Fase 2 (Results + Calendario)**: Página de resultados optimizada + calendario. Deploy final.
4. **Rollback**: Cada fase debe ser independiente. Si falla, revertir a producción anterior usando backup automático de deploy.sh.

## Open Questions

1. ¿Qué librería de calendario React usar? `react-calendar` (ligero) vs construir custom con inputs nativos.
2. ¿Cuántos slots de 30 min por día? ¿Fijos (ej. 3 slots: 9am, 11am, 3pm) o configurables?
3. ¿Quién confirma las citas? ¿Automático por email o manual por equipo Acrux?
4. ¿Necesitamos recordatorios por email 24h antes? (Requiere cron job en Hostinger)
