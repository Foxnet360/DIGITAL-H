## Why

La auditoría de DIGITAL-H reveló que, aunque el flujo básico del diagnóstico funciona, existen brechas críticas que debilitan su propósito como lead magnet de Acrux Consultores: el reporte final no se envía por email al usuario (elemento central del nurturing), la promesa de "pausar y continuar" no tiene persistencia real (solo vive en `useState`), y la identidad visual es genérica (Tailwind Indigo) en lugar de la marca de Acrux (`#1E3A5F`, `#00D4FF`). Este cambio busca cerrar esas brechas para convertir la app en una experiencia de conversión profesional y memorable.

## What Changes

- **Persistencia de Progreso**: Implementar guardado automático de respuestas y progreso en `localStorage` para permitir la pausa y continuación real del cuestionario.
- **Re-branding a Identidad Acrux**: Migrar la paleta de colores de `indigo-600` genérico a la paleta corporativa de Acrux (`#1E3A5F`, `#00D4FF`, `#10B981`, `#1F2937`). Cargar la fuente **Inter**.
- **Envío Automático de Reporte por Email**: Integrar un servicio de email posterior a la finalización del cuestionario para enviar el diagnóstico al usuario (Bienvenida + Resultados).
- **Generación de PDF Multi-Página Profesional**: Reemplazar la captura de pantalla gigante (`html2canvas`+`jsPDF`) por un reporte PDF estructurado con encabezados, pies de página y múltiples secciones.
- **Mejoras de UX/UI Gamificada**:
  - Mostrar los niveles de usuario (Explorador Digital, Visionario, etc.) en la pantalla de resultados.
  - Animar y hacer interactivo el Radar Chart con datos de benchmark.
  - Agregar indicadores de módulo/dimensión durante el cuestionario.
- **Fix de Bugs Críticos**:
  - Eliminar fugas de memoria causadas por `setTimeout` en el renderizado de badges (`App.tsx`).
  - Refactorizar la lógica de `unlockedBadges` para evitar condiciones de carrera.
- **SEO y Accesibilidad Base**: Cambiar `lang="en"` a `"es"`, agregar meta description y Open Graph.

## Capabilities

### New Capabilities
- `persisted-session`: Guardar y restaurar el estado del cuestionario (`answers`, `currentIdx`, `points`) en `localStorage` con un debounce.
- `email-report-delivery`: Enviar automáticamente el diagnóstico final (conector a Resend/SendGrid o backend Express) al completar el formulario.
- `acux-branding`: Sistema de diseño coherente con la marca Acrux, aplicando la paleta cromática y tipografía oficial.
- `pdf-report-generator`: Motor de generación de reportes PDF profesionales, multi-página y estructurados.

### Modified Capabilities
- `lead-capture-form`: Agregar checkbox explícito de consentimiento GDPR y mejorar la UX del formulario para aumentar la confianza.

## Impact

- **Frontend**: `App.tsx`, `Welcome.tsx`, `Questionnaire.tsx`, `Results.tsx`, `LeadForm.tsx`, `constants.ts`, `utils.ts`.
- **Estilos**: `index.css` (Tailwind config / variables de color).
- **Backend/Infra**: Posible necesidad de endpoint Express o Cloud Function para envío de email.
- **Dependencias**: Nuevas dependencias para generación de PDF avanzada (`jspdf-autotable`) y servicio de email (`resend` / `nodemailer`).
- **SEO**: `index.html` (metadatos).
