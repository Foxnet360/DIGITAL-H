# DIGITAL-H - Diagnóstico de Madurez Digital

## 🎯 Sobre este Proyecto

DIGITAL-H es un **lead magnet** interactivo desarrollado por **Acrux Consultores** que permite a las empresas evaluar su nivel de madurez digital en 6 dimensiones críticas.

### Ecosistema Acrux.life

Este proyecto forma parte del ecosistema de recursos digitales de Acrux:

```
acrux.life/ (Landing principal)
├── digital-h/     ← Este proyecto (Madurez Digital)
└── pulso-h/       ← Diagnóstico de Bienestar Laboral
```

**Independencia:** Cada proyecto es autónomo con su propio repositorio, pero comparten la identidad visual y el dominio principal.

---

## 🚀 Tecnologías

- **Frontend:** React 19 + TypeScript + Vite
- **Estilos:** Tailwind CSS v4
- **Gráficos:** Recharts
- **PDF:** jsPDF + html2canvas
- **Backend:** PHP (API REST simple)
- **Base de datos:** MySQL

---

## 📁 Estructura del Proyecto

```
DIGITAL-H/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Landing.tsx      # Página de inicio
│   │   ├── Questionnaire.tsx # Cuestionario 48 preguntas
│   │   ├── LeadForm.tsx     # Formulario de captura
│   │   └── Results.tsx      # Resultados y reporte
│   ├── recommendations.ts   # Motor de recomendaciones
│   ├── testimonials.ts      # Testimonios por nivel
│   ├── utm-messages.ts      # Personalización UTM
│   └── utils.ts             # Utilidades
├── public/
│   ├── api/                 # APIs PHP
│   │   ├── diagnostic.php   # Guardar diagnóstico
│   │   ├── health.php       # Health check
│   │   └── config.php       # Configuración BD
│   └── .htaccess            # Configuración Apache
├── deploy.sh                # Script de despliegue
└── package.json
```

---

## 🛠️ Instalación Local

```bash
# 1. Clonar repositorio
git clone <repo-url> digital-h
cd digital-h

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en navegador
# http://localhost:3000
```

---

## 🐳 Entorno Docker (Desarrollo Completo)

Para desarrollo con backend PHP y base de datos MySQL local:

```bash
# 1. Iniciar contenedores (PHP-Apache, MySQL, phpMyAdmin)
docker-compose up -d

# 2. Verificar que los servicios están corriendo
# - Frontend/API: http://localhost:8080
# - phpMyAdmin: http://localhost:8081
# - MySQL: localhost:3306

# 3. Ver logs
ocker-compose logs -f

# 4. Detener contenedores
docker-compose down

# 5. Detener y eliminar volúmenes (reset de BD)
docker-compose down -v
```

### Servicios Docker

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| PHP-Apache | 8080 | Servidor web con API PHP |
| MySQL | 3306 | Base de datos local |
| phpMyAdmin | 8081 | Administración de BD |

### Credenciales Docker MySQL

- **Database:** `digitalh_db`
- **User:** `digitalh_user`
- **Password:** `digitalh_pass`
- **Root Password:** `root_password`

### Desarrollo Frontend Independiente

El frontend puede ejecutarse sin Docker:

```bash
npm run dev
# http://localhost:3000 (frontend)
# http://localhost:8080 (API PHP en Docker)
```

---

## 🚀 Despliegue a Producción

### ⚠️ IMPORTANTE - Antes de Desplegar

1. **Verifica que estás en la carpeta correcta** (`digital-h/`, no `pulso-h/`)
2. **El script detectará automáticamente** si intentas desplegar en la ruta equivocada
3. **Siempre se crea un backup** antes de sobrescribir

### Comando de Despliegue

```bash
./deploy.sh
```

### Lo que hace el script:

1. ✅ **Detecta** automáticamente el proyecto (DIGITAL-H vs PULSO-H)
2. ✅ **Pregunta** el ambiente (producción o staging)
3. ✅ **Valida** que no sobrescriba PULSO-H ni otros proyectos
4. ✅ **Verifica** conexión SSH al servidor
5. ✅ **Crea** backup automático antes de modificar
6. ✅ **Corrige** automáticamente el `.htaccess` si es necesario
7. ✅ **Build** del frontend optimizado
8. ✅ **Despliega** solo los archivos necesarios
9. ✅ **Verifica** que todo funcione post-deploy

### URLs de Producción

- **Frontend:** https://acrux.life/digital-h/
- **API:** https://acrux.life/digital-h/api/diagnostic.php
- **Health Check:** https://acrux.life/digital-h/api/health.php

---

## 🔗 Integración con Acrux.life

### Flujo de Usuario

```
Usuario llega a acrux.life
        ↓
[Call to Action] → "Evalúa tu madurez digital"
        ↓
https://acrux.life/digital-h/  ← DIGITAL-H
        ↓
Usuario completa diagnóstico (15-20 min)
        ↓
Recibe reporte PDF personalizado
        ↓
[CTA] → "Agendar consultoría gratuita"
        ↓
Calendly (30 min con equipo Acrux)
```

### Personalización por Canal (UTM)

El sistema detecta automáticamente el origen del tráfico:

| UTM Source | Mensaje Personalizado |
|------------|----------------------|
| instagram | "¿Viste nuestro contenido?" |
| facebook | "Únete a las 50+ empresas..." |
| google | "Diagnóstico gratuito..." |
| email | "Bienvenido. Tu diagnóstico está listo" |
| linkedin | "¿Tu empresa está lista?" |
| orgánico | Mensaje por defecto |

**Uso:** `https://acrux.life/digital-h/?utm_source=instagram`

---

## 📊 Analytics System Architecture

### Overview

DIGITAL-H uses a centralized analytics utility (`src/utils/analytics.ts`) that follows the same pattern as PULSO-H for consistency across the Acrux ecosystem. All events are tracked via Google Analytics 4 (GA4) using `gtag`.

### GA4 Event Constants

All event names are defined in `GA4_EVENTS`:

```typescript
export const GA4_EVENTS = {
  // Pre-test
  PRETEST_VIEW: 'digital_h_pretest_view',
  PRETEST_ACCEPT: 'digital_h_pretest_accept',
  
  // Funnel
  LANDING_VIEW: 'digital_h_landing_view',
  QUESTIONNAIRE_START: 'digital_h_questionnaire_start',
  QUESTION_ANSWERED: 'digital_h_question_answered',
  QUESTIONNAIRE_COMPLETE: 'digital_h_questionnaire_complete',
  QUESTIONNAIRE_ABANDON: 'digital_h_questionnaire_abandon',
  
  // Lead capture
  LEADFORM_START: 'digital_h_leadform_start',
  LEADFORM_SUBMIT: 'digital_h_leadform_submit',
  LEADFORM_COMPLETE: 'digital_h_leadform_complete',
  
  // Results
  RESULTS_VIEW: 'digital_h_results_view',
  PDF_DOWNLOAD: 'digital_h_pdf_download',
  CTA_CLICK: 'digital_h_cta_click',
  BOOKING_CREATED: 'digital_h_booking_created',
  
  // Ecommerce (GA4 standard)
  GENERATE_LEAD: 'generate_lead',
};
```

### Event Descriptions

| Event | Trigger | Parameters |
|-------|---------|------------|
| `digital_h_landing_view` | Landing page load | `source`, `utm_source`, `utm_medium`, `utm_campaign` |
| `digital_h_pretest_view` | Pre-test screen shown | - |
| `digital_h_pretest_accept` | User accepts pre-test | `gdpr_consent`, `marketing_consent` |
| `digital_h_questionnaire_start` | Questionnaire begins | - |
| `digital_h_question_answered` | Each question answered | `question_number`, `dimension_id` |
| `digital_h_questionnaire_complete` | All 48 questions done | `score`, `level`, `duration_minutes` |
| `digital_h_questionnaire_abandon` | User leaves mid-flow | `progress_percentage`, `question_number` |
| `digital_h_leadform_start` | Lead form displayed | - |
| `digital_h_leadform_submit` | Form submitted | `challenge`, `contact_method` |
| `digital_h_leadform_complete` | Lead successfully captured | `score`, `level` |
| `digital_h_results_view` | Results page shown | `score`, `level` |
| `digital_h_pdf_download` | PDF report downloaded | - |
| `digital_h_cta_click` | Any CTA clicked | `type` |
| `digital_h_booking_created` | Calendly booking made | `date`, `time` |
| `generate_lead` | Standard GA4 conversion | `lead_source`, `score`, `level` |

### UTM Tracking

UTM parameters are automatically captured from URL and included in all events:

```typescript
// Example URL
https://acrux.life/digital-h/?utm_source=instagram&utm_medium=social&utm_campaign=q2_2026

// Events will include:
// utm_source: "instagram"
// utm_medium: "social"
// utm_campaign: "q2_2026"
```

**UTM persistence**: Parameters are maintained throughout the entire funnel via URL query string.

### KPIs Principales

- **Tasa de completitud:** % que termina las 48 preguntas
- **Conversión LeadForm:** % que completa datos personales
- **CTA Agenda:** Clicks en "Agendar consultoría"
- **Distribución UTM:** Conversión por canal de adquisición
- **Tiempo promedio:** Duración del cuestionario en minutos
- **Puntuación promedio:** IMD (Índice de Madurez Digital) medio

---

## 🎨 Características UX Implementadas

### 1. Flujo Adaptativo
- ✅ LeadForm al final (no interrumpe cuestionario)
- ✅ Guardar y continuar después
- ✅ Recuperación de sesión automática

### 2. Recomendaciones Contextuales
- ✅ Basadas en las 2 dimensiones más débiles
- ✅ Prioriza "quick wins" de bajo esfuerzo
- ✅ 18 recomendaciones específicas por dimensión

### 3. Prueba Social
- ✅ 8 testimonios segmentados por nivel de madurez
- ✅ Métricas concretas de resultados
- ✅ Avatares genéricos profesionales

### 4. Optimización de Conversión
- ✅ CTA "Agendar" como primario visual
- ✅ Sección persuasiva con bullet points
- ✅ Tracking de clicks por ubicación

---

## 🆕 New Lead Capture Fields

The lead form now captures additional qualification data to help the sales team prioritize and personalize follow-up.

### DIGITAL-H Fields

| Field | Type | Description | Business Value |
|-------|------|-------------|----------------|
| `name` | string | Full name | Personalization |
| `email` | string | Business email | Primary contact |
| `company` | string | Company name | Account identification |
| `size` | string | Company size | Segmentation (startup, SME, enterprise) |
| `industry` | string | Industry sector | Vertical targeting |
| `challenge` | string (optional) | Biggest digital transformation challenge | Sales qualification - indicates urgency and budget |
| `contactMethod` | string (optional) | Preferred contact method (email, phone, WhatsApp) | Outreach preference |
| `consultingInterest` | boolean (optional) | Interest in consulting services | Lead scoring - indicates buying intent |
| `gdprConsent` | boolean | GDPR consent | Legal compliance |
| `marketingConsent` | boolean (optional) | Marketing consent | Future campaigns |

### Field Usage in Sales Process

1. **Priority Score**: Leads with `consultingInterest=true` and detailed `challenge` get highest priority
2. **Outreach Strategy**: Use `contactMethod` preference for first contact
3. **Personalization**: Reference `challenge` in follow-up emails
4. **Segmentation**: Categorize by `size` and `industry` for targeted nurturing

## 🛡️ Seguridad y Privacidad

- ✅ **GDPR Compliant:** Checkbox de consentimiento explícito
- ✅ **Datos cifrados:** MySQL con credenciales seguras
- ✅ **Sin cookies:** Personalización UTM vía URL (sin tracking persistente)
- ✅ **HTTPS forzado:** Redirección automática en .htaccess

---

## 🔄 Rollback

Si algo sale mal después del deploy:

```bash
# Conectar al servidor
ssh -p 65002 u554044004@82.197.80.180

# Ver backups disponibles
ls ~/domains/acrux.life/public_html/ | grep backup

# Restaurar backup (reemplazar BACKUP_NAME)
cp -r ~/domains/acrux.life/public_html/BACKUP_NAME/* \
     ~/domains/acrux.life/public_html/digital-h/
```

El script de deploy crea automáticamente un backup antes de cada despliegue.

---

## 🆘 Solución de Problemas

### Error: "Cannot redefine property: ethereum"
Esto es normal, es una extensión de navegador (wallet crypto). No afecta el funcionamiento.

### Error: MIME type ('text/html') para assets
Verificar que el `.htaccess` tiene el `RewriteBase` correcto:
```apache
RewriteBase /digital-h/
```

### Página en blanco después de deploy
1. Verificar en consola del navegador errores 404
2. Confirmar que los archivos JS/CSS están en `assets/`
3. Verificar que `index.html` apunta a las rutas correctas

---

## 📞 Soporte

Para problemas de despliegue:
1. Revisar logs: `ssh -p 65002 u554044004@82.197.80.180`
2. Verificar backups en el servidor
3. Contactar al equipo de desarrollo

---

## 📝 Changelog

### 2026-05-04 - Optimización UX Mayor
- ✅ LeadForm movido al final del flujo
- ✅ Recomendaciones contextuales por dimensión
- ✅ Personalización UTM por canal
- ✅ Testimonios segmentados por madurez
- ✅ Jerarquía visual de CTAs optimizada
- ✅ Analytics mejorados (abandono, conversión)

---

**Desarrollado con ❤️ por el equipo de Acrux Consultores**

**© 2026 - Todos los derechos reservados**
