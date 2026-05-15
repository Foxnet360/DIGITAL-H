## Why

El diagnóstico DIGITAL-H actual tiene un flujo de conversión roto: el email se solicita al inicio del cuestionario (Landing → LeadForm), antes de que el usuario haya invertido tiempo o percibido valor. Esto genera abandono masivo (~60-70% según benchmarks B2B) y viola el principio del Costo Hundido. La auditoría de CRO reveló que el código fuente está desfasado respecto a producción y carece de elementos psicológicos de alta conversión en el punto de captura y la página de resultados.

## What Changes

- **Fix del flujo principal (BREAKING)**: Eliminar la captura de email al inicio. El flujo correcto será Landing → Questionnaire (48 preguntas) → LeadForm (post-Q48) → Results.
- **Arquitectura de Micro-compromisos**: Implementar progreso visual continuo durante el cuestionario (tiempo invertido, badges desbloqueados, mensajes de "no abandones ahora") para maximizar el efecto Sunk Cost Fallacy en el punto de captura.
- **Optimización del LeadForm final**: Añadir banner de inversión acumulada (*"Has invertido 15 min, tu reporte está 95% listo"*), barra de progreso 47/48 → 48/48, y mensaje de pérdida para reducir abandono en el último paso.
- **Thank You Page con Urgencia**: Reemplazar la página de resultados actual con mensajes de pérdida de productividad dinámicos por nivel de madurez, comparativo sectorial y contador de vigencia del análisis.
- **Calendario Propio de Agendamiento**: Eliminar Calendly externo. Crear componente de agendamiento inline con selector de fecha/hora, guardado en BD MySQL, y notificación por email.
- **Limpieza Técnica (BREAKING)**: Eliminar backend Express no usado en producción (server.ts, src/db.ts) y consolidar en PHP. Crear setup Docker para desarrollo local con PHP+MySQL.
- **Preparación HubSpot**: Documentar campos y endpoints necesarios para futura integración con HubSpot (sin implementar aún).

## Capabilities

### New Capabilities
- `lead-capture-q48`: Sistema de captura de leads posicionado después de la pregunta 48, con arquitectura de micro-compromisos y mensajes de inversión acumulada.
- `sunk-cost-progress`: Indicadores visuales de progreso durante el cuestionario (tiempo invertido, badges, contador de preguntas) para maximizar completion rate.
- `results-urgency`: Página de resultados dinámica con mensajes de urgencia por nivel de madurez, comparativos sectoriales y CTAs optimizados.
- `booking-calendar`: Calendario propio de agendamiento con selector de fecha/hora, persistencia en MySQL y notificaciones por email.
- `docker-dev-setup`: Entorno de desarrollo local con Docker (PHP-Apache + MySQL) para replicar producción.

### Modified Capabilities
- `questionnaire-flow`: Cambio en el flujo de navegación — ya no inicia con LeadForm, sino con Questionnaire directo. Requiere ajuste en sessionStorage y recuperación de sesión.

## Impact

- **Frontend**: `App.tsx` (flujo de pantallas), `Landing.tsx` (onStart), `Questionnaire.tsx` (progreso visual, badges), `LeadForm.tsx` (posición y contexto), `Results.tsx` (urgencia, CTAs), nuevo componente `BookingCalendar.tsx`.
- **Backend**: Eliminar `server.ts`, `src/db.ts`. Crear `docker-compose.yml`. Ajustar `public/digital-h/api/diagnostic.php` para guardar citas agendadas.
- **Base de datos**: Nueva tabla `digitalh_bookings` para citas agendadas. Ajustar `digitalh_results` si es necesario.
- **Dependencias**: Eliminar `express`, `mysql2`, `nodemailer` del frontend (mantener en PHP backend). Posiblemente añadir librería de calendario React (ej. `react-calendar` o `react-datepicker`).
- **SEO/Analytics**: Ajustar eventos gtag para reflejar nuevo flujo (`digital_h_leadform_start` ahora ocurre post-Q48).
- **Deploy**: Actualizar `deploy.sh` para eliminar referencias a Express. Crear documentación Docker para desarrollo local.
