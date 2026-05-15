# Guía de Configuración GitHub - DIGITAL-H

## 🚀 Crear Repositorio Independiente

### 1. Crear Repo en GitHub

1. Ir a https://github.com/new
2. Nombre del repositorio: `digital-h` o `acrux-digital-h`
3. Visibilidad: **Privado** (recomendado)
4. NO inicializar con README (ya lo tenemos)
5. Crear repositorio

### 2. Configurar Git Local

```bash
# Desde la carpeta del proyecto
cd /ruta/a/DIGITAL-H

# Inicializar repositorio
git init

# Agregar remote
git remote add origin https://github.com/tu-usuario/digital-h.git

# Primera subida
git add .
git commit -m "Initial commit: DIGITAL-H lead magnet v1.0"
git branch -M main
git push -u origin main
```

---

## 🔗 Integración con Ecosistema Acrux

### Estructura Recomendada en GitHub

```
Organización: acrux-consultores (o tu-usuario)
├── acrux-website/      ← Landing principal (acrux.life)
├── digital-h/          ← Este repositorio
├── pulso-h/            ← Diagnóstico bienestar
└── docs/               ← Documentación compartida
```

### Convenciones de Ramas

```
main        ← Producción estable
├── develop ← Desarrollo activo
├── feature/nombre  ← Características nuevas
└── hotfix/xxx      ← Correcciones urgentes
```

### Tags de Versión

```bash
# Después de cada deploy exitoso
git tag -a v1.2.0 -m "Version 1.2.0 - UX Optimization"
git push origin v1.2.0
```

---

## 🔄 Flujo de Trabajo con Deploy

### 1. Desarrollo Local

```bash
# Crear rama para nueva característica
git checkout -b feature/nueva-funcionalidad

# Hacer cambios...
npm run dev  # Testear localmente

# Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

### 2. Pull Request (Opcional pero recomendado)

```bash
# Crear PR en GitHub
# Revisar cambios
# Merge a main
```

### 3. Despliegue a Producción

```bash
# Asegurarte de estar en main
git checkout main
git pull origin main

# Ejecutar deploy
./deploy.sh

# Seguir las instrucciones interactivas
# ✅ Seleccionar ambiente
# ✅ Confirmar ruta
# ✅ Verificar post-deploy
```

---

## 📝 Archivos Importantes para Git

### .gitignore (Actualizar si es necesario)

```gitignore
# Dependencias
node_modules/

# Build
dist/
deploy/

# Ambiente
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

### Archivos que SÍ deben estar en Git

```
✅ src/              (código fuente)
✅ public/           (assets estáticos + API PHP)
✅ deploy.sh         (script de despliegue)
✅ package.json      (dependencias)
✅ vite.config.ts    (configuración build)
✅ tsconfig.json     (configuración TypeScript)
✅ README.md         (documentación)
❌ node_modules/     (se instala con npm install)
❌ dist/             (se genera con npm run build)
❌ .env              (variables sensibles)
```

---

## 🌐 Variables de Entorno (Local)

Crear archivo `.env` en desarrollo (NO subir a Git):

```env
# Base de datos (solo si usas backend local)
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=digitalh

# API Keys (si aplica)
GEMINI_API_KEY=tu-api-key
```

---

## 📋 Checklist antes de Commit

- [ ] Tests pasan: `npm run test:run`
- [ ] Build exitoso: `npm run build`
- [ ] No errores de TypeScript: `npm run lint`
- [ ] `.env` NO está en stage
- [ ] `deploy.sh` tiene permisos: `chmod +x deploy.sh`
- [ ] README actualizado (si hay cambios importantes)

---

## 🚀 GitHub Actions (Opcional - CI/CD)

### Crear `.github/workflows/deploy.yml`

```yaml
name: Deploy DIGITAL-H

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:run
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Hostinger
      run: ./deploy.sh
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
```

### Configurar Secrets en GitHub

1. Ir a Settings → Secrets and variables → Actions
2. Agregar `SSH_PRIVATE_KEY` con la clave privada
3. Agregar `DEPLOY_HOST`, `DEPLOY_USER` si es necesario

---

## 🔄 Sincronización con Otros Proyectos

### Si necesitas compartir código entre proyectos:

**Opción 1: Submódulos Git (Avanzado)**
```bash
# En pulso-h/
git submodule add https://github.com/acrux-consultores/shared-components.git src/shared/
```

**Opción 2: Paquete NPM privado**
```bash
# Crear paquete compartido
# Publicar en GitHub Packages o npm private
npm install @acrux/shared-components
```

**Opción 3: Copiar manualmente (Recomendado para lead magnets)**
- Cada proyecto es independiente
- Comparten convenciones pero no código
- Más simple de mantener

---

## 📊 GitHub Project Board (Opcional)

Crear un Project para tracking:

```
To Do → In Progress → Review → Done
```

### Etiquetas recomendadas:
- `bug` - Correcciones
- `feature` - Nuevas funcionalidades
- `ux` - Mejoras de experiencia
- `deploy` - Cambios de despliegue
- `analytics` - Tracking y métricas

---

## 🆘 Troubleshooting Git

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/tu-usuario/digital-h.git
```

### Error: "failed to push some refs"
```bash
# Actualizar primero
git pull origin main --rebase
git push origin main
```

### Error: "Permission denied"
```bash
# Verificar acceso al repo
# Settings → Manage access → Invite collaborator
```

---

## 📞 Contacto

Para configuración de GitHub o permisos:
- Admin del repositorio: [tu-email@acrux.life]
- Equipo de desarrollo: [equipo@acrux.life]

---

**¡Listo! Tu repositorio DIGITAL-H está configurado y listo para el equipo.** 🎉
