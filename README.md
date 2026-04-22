# DIGITAL-H: Diagnóstico de Madurez Digital

## 🎯 Descripción Oficial

**DIGITAL-H** es una aplicación web interactiva de diagnóstico empresarial desarrollada exclusivamente para **Acrux Consultores** (`acrux.life`). La herramienta evalúa el nivel de madurez digital de organizaciones PYMEs mediante un cuestionario holístico de 48 preguntas distribuidas en 6 dimensiones críticas de transformación digital.

### Características Principales

- **Diagnóstico Holístico**: 48 preguntas evaluando 6 dimensiones empresariales
- **Gamificación**: Sistema de puntos y logros (badges) durante el cuestionario
- **Reporte PDF Personalizado**: Generación automática de informes con gráficas de radar
- **Análisis por Dimensiones**: Evaluación individualizada de cada área
- **Hoja de Ruta Estratégica**: Recomendaciones priorizadas según el nivel de madurez
- **Captura de Leads**: Formulario inteligente con consentimiento GDPR
- **Email Automático**: Envío de agradecimiento con resultados al completar
- **Persistencia de Sesión**: Posibilidad de pausar y continuar el diagnóstico

### Dimensiones Evaluadas

| Dimensión | Icono | Descripción |
|-----------|-------|-------------|
| **Estrategia Digital** | 🚀 | Visión, roadmap, alineación con negocio, gobernanza |
| **Cultura y Liderazgo** | ❤️ | Mindset digital, liderazgo consciente, valores organizacionales |
| **Talento y Competencias** | 👥 | People analytics, desarrollo, RRHH 4.0, habilidades digitales |
| **Tecnología e Infraestructura** | 💻 | Stack tecnológico, ciberseguridad, integración, automatización |
| **Procesos y Datos** | 📊 | Gestión de procesos, analítica de datos, toma de decisiones |
| **Experiencia y Bienestar** | ⭐ | Engagement, bienestar humano, experiencia del empleado |

---

## 🏗️ Arquitectura del Proyecto

```
DIGITAL-H/
├── src/                          # Código fuente React + TypeScript
│   ├── components/               # Componentes React
│   │   ├── Landing.tsx           # Página de inicio
│   │   ├── Welcome.tsx           # Bienvenida al cuestionario
│   │   ├── Questionnaire.tsx     # Cuestionario interactivo
│   │   ├── LeadForm.tsx          # Formulario de captura de leads
│   │   └── Results.tsx           # Resultados y reporte
│   ├── types/                    # Definiciones de tipos TypeScript
│   │   ├── types.ts              # Tipos principales
│   │   └── shared.ts             # Tipos compartidos (Lead, DiagnosticRequest)
│   ├── utils.ts                  # Utilidades (cálculo IMD, niveles)
│   ├── levels.ts                 # Mapeo de niveles a etiquetas
│   ├── constants.ts              # Preguntas, dimensiones, badges
│   ├── sessionStorage.ts         # Persistencia de sesión en localStorage
│   ├── generateReportPDF.ts      # Generador de PDF con jsPDF
│   ├── db.ts                     # Conexión MySQL (desarrollo local)
│   └── firebase.ts               # [REMOVIDO] Configuración Firebase
├── public/digital-h/api/         # Backend PHP para producción
│   ├── config.php                # Configuración BD y SMTP
│   ├── diagnostic.php            # Endpoint: Guardar diagnóstico
│   └── health.php                # Endpoint: Health check BD
├── database/                     # Esquemas SQL
│   └── digitalh_schema.sql       # Esquema de la tabla principal
├── dist/                         # Build de producción (Vite)
├── .env                          # Variables de entorno (no versionado)
├── .env.example                  # Ejemplo de variables de entorno
├── vite.config.ts                # Configuración Vite
├── tsconfig.json                 # Configuración TypeScript
├── package.json                  # Dependencias npm
├── server.ts                     # Servidor Express (desarrollo local)
└── deploy.sh                     # Script de despliegue
```

---

## 🚀 Cambios Realizados en esta Versión

### 1. Limpieza de Código y Dependencias

**Eliminados (código muerto):**
- ❌ `src/firebase.ts` - Firebase no se utilizaba en producción
- ❌ `firebase-applet-config.json` - Configuración Firebase
- ❌ `firebase-blueprint.json` - Blueprint Firebase
- ❌ `firestore.rules` - Reglas Firestore
- ❌ `useDebouncedSessionSave` de `sessionStorage.ts` - Hook no utilizado
- ❌ `getCurrentDimension` de `App.tsx` - Función no utilizada
- ❌ `getModuleProgress` de `App.tsx` - Función no utilizada
- ❌ Imports sin usar en componentes (Layout, ShieldCheck, Users, Heart, Star)

**Dependencias removidas:**
- ❌ `firebase` (^12.11.0) - No utilizado
- ❌ `html2canvas` (^1.4.1) - No utilizado (PDF usa jsPDF directamente)
- ❌ `@google/genai` (^1.29.0) - No utilizado

### 2. Centralización de Lógica

**Unificación de lógica de niveles:**
- ✅ Creado `src/levels.ts` con objeto `USER_LEVELS` centralizado
- ✅ `Results.tsx` y `server.ts` ahora importan desde `levels.ts`
- ✅ Eliminado `getDimensionLevel` de `generateReportPDF.ts` - ahora usa `getMaturityLevel` desde `utils.ts`
- ✅ Eliminado `getUserLevelLabel` de `server.ts` - reemplazado por `USER_LEVELS`

**Compartir tipos entre frontend y backend:**
- ✅ Creado `src/types/shared.ts` con interfaces `Lead` y `DiagnosticRequest`
- ✅ `src/types.ts` re-exporta desde `shared.ts`
- ✅ `server.ts` importa tipos desde `./src/types/shared`
- ✅ Eliminados todos los `any` en props de componentes principales

### 3. Seguridad

- ✅ Eliminadas credenciales hardcodeadas de `src/db.ts`
- ✅ `db.ts` ahora requiere variables de entorno sin valores por defecto
- ✅ `.env` configurado con todas las variables necesarias
- ✅ Credenciales no expuestas en el código fuente

### 4. Nuevas Características

**Backend PHP para producción:**
- ✅ `public/digital-h/api/config.php` - Configuración centralizada BD + SMTP
- ✅ `public/digital-h/api/diagnostic.php` - API REST para guardar diagnósticos
- ✅ `public/digital-h/api/health.php` - Health check de conexión a BD
- ✅ `.htaccess` con configuración CORS, HTTPS y protección de archivos

**Generación de PDF:**
- ✅ Convertido logo de SVG a PNG para compatibilidad con jsPDF
- ✅ PDF incluye portada, análisis por dimensiones, recomendaciones y hoja de ruta

**Email de agradecimiento:**
- ✅ Template HTML profesional con branding de Acrux
- ✅ Envío automático al completar diagnóstico
- ✅ Incluye IMD, nivel y descripción personalizada

### 5. Correcciones de Bugs

- ✅ Arreglado `bind_param` en PHP para tipos de datos correctos
- ✅ Eliminadas columnas de dimensiones que no existían en BD
- ✅ Corregido endpoint de API en frontend (`/digital-h/api/diagnostic.php`)
- ✅ Optimizado bundle quitando dependencias innecesarias

---

## 💻 Desarrollo Local

### Requisitos Previos

- Node.js 18+ 
- MySQL 5.7+ o MariaDB
- npm o yarn

### Instalación

1. Clonar repositorio:
```bash
git clone <url-del-repositorio>
cd DIGITAL-H
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. Crear base de datos:
```bash
mysql -u root -p < database/digitalh_schema.sql
```

5. Iniciar servidor de desarrollo:
```bash
npm run dev
```

El frontend estará en `http://localhost:3000`
El backend Express en `http://localhost:3001`

---

## 🌐 Despliegue en Producción (Hostinger)

### Opción 1: PHP + Frontend Estático (Recomendada)

Esta opción usa el backend PHP incluido, ideal para hosting compartido:

```bash
# Compilar frontend
npm run build

# Copiar archivos al directorio de despliegue
cp -r dist/* public/digital-h/

# Subir a Hostinger (reemplazar con tus credenciales)
scp -P 65002 -r public/digital-h/* u554044004@82.197.80.180:~/domains/acrux.life/public_html/digital-h/
```

### Estructura en Servidor

```
domains/acrux.life/public_html/digital-h/
├── index.html              # Frontend compilado
├── assets/                 # CSS, JS, imágenes
├── api/
│   ├── config.php          # Config BD y SMTP
│   ├── diagnostic.php      # API guardar diagnósticos
│   └── health.php          # Health check
├── .htaccess               # Config Apache
└── logo.png                # Logo para PDF
```

### Configuración de Variables de Entorno

En tu panel de Hostinger, ve a **Advanced** → **Environment Variables**:

```env
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_mysql
DB_NAME=tu_base_datos
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tu_email@acrux.life
SMTP_PASS=tu_password_email
SMTP_FROM=DIGITAL-H <tu_email@acrux.life>
```

### Base de Datos

Asegúrate de crear la tabla `digitalh_results`:

```sql
CREATE TABLE IF NOT EXISTS digitalh_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    company_size VARCHAR(50),
    imd_score INT NOT NULL,
    maturity_level VARCHAR(50) NOT NULL,
    answers_json LONGTEXT,
    dimension_strategy DECIMAL(5,2),
    dimension_culture DECIMAL(5,2),
    dimension_talent DECIMAL(5,2),
    dimension_tech DECIMAL(5,2),
    dimension_process DECIMAL(5,2),
    dimension_wellbeing DECIMAL(5,2),
    gdpr_consent TINYINT(1) DEFAULT 0,
    gdpr_timestamp DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

### Guardar Diagnóstico
- **URL**: `POST /digital-h/api/diagnostic.php`
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "email": "usuario@empresa.com",
  "name": "Juan Pérez",
  "company": "Empresa S.A.S",
  "size": "51-250",
  "imd": 72,
  "level": "Avanzado",
  "answers": {"E1.1": 4, "E1.2": 5, ...},
  "gdprConsent": true,
  "gdprTimestamp": 1713456000000
}
```

### Health Check
- **URL**: `GET /digital-h/api/health.php`
- **Response**: `{"status":"ok","database":"connected"}`

---

## 📊 Niveles de Madurez Digital

| Nivel | IMD | Descripción |
|-------|-----|-------------|
| **Inicial** | ≤30% | Transformación digital no iniciada |
| **Emergente** | 31-45% | Primeros pasos digitales |
| **Desarrollo** | 46-60% | Transformación en curso |
| **Avanzado** | 61-75% | Buena madurez digital |
| **Excelente** | 76-90% | Alta madurez e innovación |
| **Referente** | >90% | Excelencia digital |

---

## 🛠️ Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Compilar para producción
npm run preview   # Previsualizar build
npm run lint      # Verificar TypeScript
npm run clean     # Limpiar carpeta dist
```

---

## 📄 Licencia y Créditos

**Desarrollado exclusivamente para Acrux Consultores**
- 🌐 Web: https://acrux.life
- 📧 Email: contacto@acrux.life
- 📍 Ubicación: Armenia, Quindío, Colombia

© 2025 Acrux Consultores - Todos los derechos reservados.

---

## 🆘 Soporte

Para soporte técnico o consultas sobre DIGITAL-H:
- Revisa la documentación de despliegue: `DEPLOY_HOSTINGER.md`
- Contacta al equipo de desarrollo de Acrux Consultores
- Reporta issues en el repositorio de GitHub
