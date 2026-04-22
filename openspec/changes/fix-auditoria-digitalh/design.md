## Context

DIGITAL-H es una SPA React 19 montada en Vite, desplegada como subdominio/applet dentro del ecosistema de Acrux Consultores (`acrux.life`). El stack actual incluye Tailwind CSS v4, Framer Motion, Recharts, Firebase Firestore, html2canvas y jsPDF. La auditoría reveló que la aplicación funciona técnicamente pero carece de identidad de marca, persistencia de estado, mecanismo de envío de reportes y un PDF profesional. Este diseño aborda cómo cerrar esas brechas sin reescribir la arquitectura base.

## Goals / Non-Goals

**Goals:**
- Implementar persistencia real del progreso del cuestionario via `localStorage`.
- Aplicar el sistema de diseño de Acrux (colores, tipografía) de forma coherente en toda la app.
- Enviar automáticamente un email con el resumen del diagnóstico al completar.
- Generar un reporte PDF multi-página estructurado y profesional.
- Corregir bugs críticos en gamificación (`setTimeout`, badges).
- Mejorar SEO básico (`lang="es"`, meta tags).

**Non-Goals:**
- Reemplazar Firebase Firestore por otra base de datos.
- Implementar autenticación de usuarios.
- Crear un backend completo con API REST extensa.
- Rediseñar la arquitectura de componentes (se mantienen los 5 componentes principales).

## Decisions

### 1. Persistencia: localStorage vs Firestore
**Decision**: Usar `localStorage` para la sesión activa del cuestionario.
**Rationale**: Es más rápido, no requiere autenticación ni escrituras en red en cada respuesta, y cumple la promesa de "pausar y continuar" sin costo. Solo al finalizar se escribe en Firestore.
**Alternatives considered**: Escribir cada respuesta a Firestore en tiempo real (descartado por latencia, costo y necesidad de auth).

### 2. Re-branding: Tailwind Config vs CSS Variables
**Decision**: Extender el tema de Tailwind v4 mediante variables CSS en `index.css` y mapear las clases utilitarias a los tokens de Acrux.
**Rationale**: Tailwind v4 usa CSS-first configuration. Definir `--color-primary: #1E3A5F` y `--color-accent: #00D4FF` en `:root` permite un reemplazo global sin tocar cada clase inline.
**Alternatives considered**: Reemplazar manualmente todas las clases `indigo-600` (descartado por mantenibilidad y riesgo de inconsistencias).

### 3. Email Delivery: Firebase Extension vs Express Endpoint
**Decision**: Inicialmente, exponer un endpoint POST en el servidor Express ya declarado en `package.json`, usando `resend` o `nodemailer`.
**Rationale**: La dependencia `express` ya existe en el proyecto (aunque no se usa), lo que sugiere que el plan original incluía un backend. Usar un endpoint propio da control total sobre el template del email y evita depender de Firebase Extensions de pago.
**Alternatives considered**: Firebase Extension de Email Trigger (descartado por menor flexibilidad de branding y costo). SendGrid directo desde frontend (descartado por seguridad de API keys).

### 4. PDF Generation: jsPDF + autoTable vs Puppeteer
**Decision**: Mantener `jsPDF` pero agregar `jspdf-autotable` para tablas estructuradas, y generar el PDF programáticamente página por página en lugar de usar `html2canvas`.
**Rationale**: `html2canvas` genera una imagen gigante de una sola página, lo cual no es un "reporte profesional". Construir el PDF con la API de jsPDF permite encabezados, pies de página, saltos de página controlados y contenido vectorial.
**Alternatives considered**: Puppeteer (descartado por peso y complejidad en un entorno estático/Hostinger).

### 5. Gamification Fix: useRef para setTimeout
**Decision**: Usar `useRef` para almacenar el timer ID del badge y limpiarlo en el cleanup del efecto.
**Rationale**: Elimina la fuga de memoria y los timers acumulados en cada render.
**Alternatives considered**: Mover la lógica de auto-hide a un custom hook (`useAutoHide`) (viable pero overkill para este cambio).

## Risks / Trade-offs

- **[Risk]** El endpoint de email expone una API pública que podría ser abusada para envío de spam. → **Mitigation**: Implementar rate limiting básico por IP en Express y validar que solo se envíe si existe un registro previo en Firestore.
- **[Risk]** `localStorage` puede ser borrado por el usuario o por políticas del navegador (modo privado). → **Mitigation**: Mostrar un mensaje claro en Welcome de que el progreso se guarda localmente; no prometer persistencia infalible.
- **[Risk]** Cambiar la paleta de colores puede afectar la legibilidad de componentes existentes si no se revisan contraste WCAG. → **Mitigation**: Verificar que `#1E3A5F` sobre blanco y `#00D4FF` sobre oscuro cumplan ratios de contraste AA.
- **[Risk]** El PDF programático con jsPDF requiere más código que `html2canvas` y puede ser más frágil ante cambios de contenido. → **Mitigation**: Encapsular la generación en un helper (`generateReportPDF`) con tests manuales y datos de ejemplo.

## Migration Plan

1. **Phase 1 – Styling & Fixes**: Aplicar CSS variables de Acrux, corregir `setTimeout` y badge logic, cambiar `lang` en `index.html`. No requiere backend.
2. **Phase 2 – Persistence**: Implementar `localStorage` session save/restore en `App.tsx`. No requiere backend.
3. **Phase 3 – Email Backend**: Crear servidor Express mínimo con endpoint `/api/send-report`. Configurar variables de entorno para Resend/SendGrid. Desplegar junto al build estático o en un servicio separado.
4. **Phase 4 – PDF Engine**: Reemplazar `html2canvas`+`jsPDF` actual por helper `jspdf-autotable`. Integrar en `Results.tsx`.
5. **Phase 5 – QA & Rollback**: Probar flujo completo end-to-end. Rollback es trivial: revertir commit o eliminar `dist/` y redeployar versión anterior.

## Open Questions

- ¿Existe una cuenta de Resend/SendGrid ya configurada para Acrux, o se prefiere otro proveedor?
- ¿El subdominio en Hostinger permite ejecutar un proceso Node.js/Express, o el despliegue es 100% estático (requiriendo que el email se maneje via Cloud Function o similar)?
- ¿Se cuenta con un logo oficial de Acrux en formato SVG/PNG para incluir en el PDF?
