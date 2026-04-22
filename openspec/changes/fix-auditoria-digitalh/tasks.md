## 1. Branding y Sistema de Diseño Acrux

- [x] 1.1 Agregar variables CSS de la paleta Acrux en `src/index.css` (`--color-primary: #1E3A5F`, `--color-accent: #00D4FF`, etc.)
- [x] 1.2 Configurar Tailwind v4 para consumir las nuevas variables como tokens de color (`primary`, `accent`, `success`, etc.)
- [x] 1.3 Cargar fuente Inter desde Google Fonts o CDN en `index.html`
- [x] 1.4 Reemplazar todas las clases `indigo-600` y similares por los nuevos tokens de color en `Landing.tsx`, `Welcome.tsx`, `Questionnaire.tsx`, `LeadForm.tsx`, `Results.tsx`
- [x] 1.5 Verificar contraste WCAG 2.1 AA en los nuevos colores sobre fondos blanco y oscuro

## 2. Persistencia de Sesión (localStorage)

- [x] 2.1 Crear helper `sessionStorage.ts` con funciones `saveSession`, `loadSession`, `clearSession` que persistan `answers`, `currentIdx`, `points`, `unlockedBadges`
- [x] 2.2 Integrar `saveSession` con debounce de 2 segundos en `App.tsx` cada vez que cambia `answers`
- [x] 2.3 En `App.tsx`, al montar el componente, detectar si existe sesión guardada y mostrar modal/prompt de "Continuar donde lo dejaste"
- [x] 2.4 Restaurar estado desde localStorage si el usuario acepta continuar
- [x] 2.5 Invocar `clearSession` al finalizar el diagnóstico exitosamente (`finishDiagnostic`)
- [x] 2.6 Invocar `clearSession` cuando el usuario elige "Reiniciar" o inicia un nuevo diagnóstico

## 3. Fixes de Gamificación y Bugs Críticos

- [x] 3.1 Reemplazar el `setTimeout` inline en el JSX de badges (`App.tsx`) por un `useRef` + `useEffect` que limpie el timer al desmontar
- [x] 3.2 Refactorizar la lógica de `unlockedBadges` en `App.tsx` para usar un `useEffect` separado con dependencias correctas y evitar condiciones de carrera
- [x] 3.3 Agregar el nivel de usuario (Explorador Digital, Visionario, etc.) en la pantalla `Results.tsx` basado en el IMD
- [x] 3.4 Agregar indicadores visuales de módulo/dimensión en `Questionnaire.tsx` (ej. pills o barra de módulos)

## 4. Mejoras al Lead Capture Form

- [x] 4.1 Agregar checkbox explícito de consentimiento GDPR en `LeadForm.tsx` (requerido, sin tick por defecto)
- [x] 4.2 Implementar validación visual del checkbox: si no está marcado, bloquear submit y mostrar error
- [x] 4.3 Registrar el timestamp de consentimiento junto con los datos del lead en Firestore
- [x] 4.4 Agregar nota de privacidad debajo del botón de submit ("Tus datos están protegidos...")
- [x] 4.5 Verificar que el dropdown de tamaño de empresa siga siendo required con mensaje de error claro

## 5. Backend de Email Delivery

- [x] 5.1 Crear servidor Express mínimo (`server.ts` o `api/index.ts`) con un endpoint `POST /api/send-report`
- [x] 5.2 Instalar y configurar `resend` (o `nodemailer` con SendGrid) usando variables de entorno
- [x] 5.3 Implementar lógica del endpoint: recibir `{email, name, company, imd, level, resultsUrl}`, validar inputs, enviar email con template HTML
- [x] 5.4 Implementar rate limiting básico por IP en el endpoint de email
- [x] 5.5 Integrar la llamada al endpoint desde `App.tsx` dentro de `finishDiagnostic`, con manejo de errores silencioso (no bloquear results)
- [x] 5.6 Agregar `APP_URL` y clave de email a `.env.example`

## 6. Generación de PDF Profesional

- [x] 6.1 Instalar `jspdf-autotable` como dependencia
- [x] 6.2 Crear helper `generateReportPDF.ts` que construya un PDF multi-página usando jsPDF + autoTable
- [x] 6.3 Implementar secciones del PDF: Portada (nombre, empresa, IMD, nivel), Análisis por Dimensión (tabla), Recomendaciones, Hoja de Ruta
- [x] 6.4 Agregar header/footer en cada página (título DIGITAL-H, nombre empresa, número de página)
- [x] 6.5 Reemplazar el handler `handleDownloadPDF` en `Results.tsx` para usar el nuevo helper en lugar de `html2canvas`+`jsPDF`
- [x] 6.6 Incluir el enlace de descarga del PDF en el cuerpo del email enviado (o generar el PDF como blob descargable)

## 7. SEO y Accesibilidad

- [x] 7.1 Cambiar `<html lang="en">` a `<html lang="es">` en `index.html`
- [x] 7.2 Agregar `<meta name="description">` optimizado para CTR en `index.html`
- [x] 7.3 Agregar Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`) en `index.html`
- [x] 7.4 Verificar que todos los inputs del formulario tengan labels asociados correctamente

## 8. QA, Testing y Despliegue

- [x] 8.1 Ejecutar `npm run lint` y corregir errores de TypeScript
- [ ] 8.2 Probar flujo completo end-to-end: Landing → Quiz → LeadForm → Results → PDF → Email
- [ ] 8.3 Verificar que `localStorage` persiste y restaura correctamente tras F5
- [ ] 8.4 Verificar que el email se envía y contiene datos correctos (usar sandbox de Resend)
- [ ] 8.5 Verificar que el PDF descargado tiene múltiples páginas y datos correctos
- [x] 8.6 Ejecutar `npm run build` y confirmar que no hay errores de compilación
- [ ] 8.7 Revisar visualmente en mobile (viewport 375px) que el branding y layout no se rompen

## 9. Base de Datos MySQL (acrux.life)

- [x] 9.1 Crear conexión a MySQL usando credenciales de Hostinger
- [x] 9.2 Crear tabla `digitalh_results` con campos para diagnósticos completos
- [x] 9.3 Implementar cálculo automático de dimensiones (strategy, culture, talent, tech, process, wellbeing)
- [x] 9.4 Actualizar endpoint `/api/diagnostic` para usar nueva tabla
- [x] 9.5 Agregar vista `all_leads` que unifica contacts + digitalh_results
- [x] 9.6 Agregar tabla `digitalh_events` para tracking de acciones (opcional)
- [x] 9.7 Verificar compatibilidad con tablas existentes (`contacts`, `subscribers`)
