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

## 📊 Métricas y Analytics

### Eventos Trackeados (gtag)

| Evento | Descripción |
|--------|-------------|
| `digital_h_complete` | Diagnóstico completado |
| `digital_h_leadform_start` | Usuario llega al formulario |
| `digital_h_questionnaire_abandon` | Abandono durante cuestionario |
| `digital_h_cta_click` | Click en cualquier CTA |

### KPIs Principales

- **Tasa de completitud:** % que termina las 48 preguntas
- **Conversión LeadForm:** % que completa datos personales
- **CTA Agenda:** Clicks en "Agendar consultoría"
- **Distribución UTM:** Conversión por canal de adquisición

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
