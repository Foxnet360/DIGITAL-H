# 🚀 Guía de Despliegue en Hostinger

## Requisitos Previos

- Cuenta Hostinger con acceso al Panel de Control
- Node.js disponible en el hosting (o usar VPS)
- Acceso a File Manager o FTP

---

## Paso 1: Preparar Archivos

### 1.1 Compilar el Frontend

```bash
# En tu computadora local
npm install
npm run build
```

Esto genera la carpeta `dist/` con el frontend compilado.

### 1.2 Archivos Necesarios para Subir

Debes subir estos archivos/carpetas:

```
digital-h/
├── dist/                 ← Frontend compilado (generado por npm run build)
├── server.ts             ← Backend Express
├── src/
│   └── db.ts             ← Conexión MySQL
├── database/
│   └── digitalh_schema.sql  ← Script SQL (ya ejecutado)
├── package.json
├── package-lock.json
├── .env                  ← Variables de entorno (NO subir a Git)
├── tsconfig.json
└── vite.config.ts
```

---

## Paso 2: Subir a Hostinger

### Opción A: File Manager (Recomendado)

1. Accede al **File Manager** de Hostinger
2. Navega a `public_html/` (o crea subcarpeta `public_html/digital-h/`)
3. Sube todos los archivos listados arriba
4. **IMPORTANTE**: No subas `node_modules/` ni `.git/`

### Opción B: FTP/SFTP

```bash
# Usando FileZilla o similar
Host: tu-dominio.com o IP del servidor
Usuario: tu-usuario-ftp
Contraseña: tu-contraseña-ftp
Puerto: 21 (FTP) o 22 (SFTP)
```

---

## Paso 3: Configurar Backend Node.js

### 3.1 Instalar Dependencias

```bash
# Conéctate por SSH a tu hosting (si tienes acceso)
ssh usuario@tu-dominio.com

# Navega a la carpeta
cd public_html/digital-h

# Instalar dependencias
npm install --production
```

### 3.2 Sin acceso SSH (File Manager)

1. En tu computadora local, ejecuta:
```bash
npm install --production
```

2. Sube la carpeta `node_modules/` completa por FTP (pesada pero necesaria)

---

## Paso 4: Configurar Variables de Entorno

### 4.1 Crear archivo .env en Hostinger

En el File Manager, crea/edita el archivo `.env`:

```env
# Database
DB_HOST=localhost
DB_USER=u554044004_acruxuser
DB_PASSWORD=4Crux2026*
DB_NAME=u554044004_acruxdb

# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://acrux.life

# Email SMTP
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=hola@acrux.life
SMTP_PASS=4Crux2026*
SMTP_FROM=DIGITAL-H <hola@acrux.life>
```

### 4.2 Proteger el archivo .env

En File Manager, cambia permisos del archivo `.env`:
- **Permisos**: 600 (solo lectura/escritura para el propietario)

---

## Paso 5: Iniciar el Servidor

### Opción A: Con PM2 (Recomendado si tienes VPS)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar el servidor
pm2 start server.ts --name digitalh-api

# Guardar configuración
pm2 save
pm2 startup
```

### Opción B: Con Node directo

```bash
# Navegar a la carpeta
cd public_html/digital-h

# Compilar TypeScript
npx tsx server.ts

# O si prefieres en background:
nohup npx tsx server.ts > app.log 2>&1 &
echo $! > app.pid
```

### Opción C: Usando Cron (para mantener vivo)

Si no tienes PM2, crea un script en cPanel → Cron Jobs:

```bash
*/5 * * * * cd /home/tu-usuario/public_html/digital-h && pgrep -f "server.ts" || npx tsx server.ts >> app.log 2>&1 &
echo $! > app.pid
```

---

## Paso 6: Configurar el Dominio

### 6.1 Subdominio (Recomendado)

Crea un subdominio en Hostinger:
- **Subdominio**: `digital-h.acrux.life`
- **Apunta a**: `public_html/digital-h/dist/`

### 6.2 Carpeta dentro del dominio principal

Si prefieres `acrux.life/digital-h/`:

1. Sube el contenido de `dist/` a `public_html/digital-h/`
2. El backend corre en `acrux.life:3000` (o puerto que configures)

### 6.3 Proxy Inverso (Avanzado)

Si tienes acceso a Apache/Nginx:

```apache
# .htaccess en public_html/digital-h/
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
```

---

## Paso 7: Verificar Instalación

### 7.1 Verificar Backend

```bash
# Probar endpoint de salud
curl https://tu-dominio.com/api/health

# Debe responder:
{"status":"ok","database":"connected"}
```

### 7.2 Verificar Frontend

1. Abre `https://tu-dominio.com/digital-h/` en navegador
2. Completa un diagnóstico de prueba
3. Verifica que:
   - Se guarde en la base de datos
   - Llegue el email de agradecimiento
   - Se genere el PDF

### 7.3 Logs

```bash
# Ver logs en tiempo real
tail -f public_html/digital-h/app.log

# O con PM2
pm2 logs digitalh-api
```

---

## 🔧 Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install --production
```

### Error: "Permission denied"
```bash
# Cambiar permisos
chmod -R 755 public_html/digital-h/
chmod 600 public_html/digital-h/.env
```

### Error: "Port already in use"
```bash
# Buscar proceso usando el puerto
lsof -i :3000

# Matar proceso
kill -9 PID
```

### Error: "Connection refused" (MySQL)
- Verificar que la base de datos existe
- Confirmar credenciales en `.env`
- Verificar que el usuario MySQL tiene permisos desde localhost

---

## 📋 Checklist Final

- [ ] Frontend compilado en `dist/`
- [ ] Archivos subidos a Hostinger
- [ ] Dependencias instaladas (`node_modules/`)
- [ ] Archivo `.env` configurado y protegido
- [ ] Base de datos con tabla `digitalh_results`
- [ ] Servidor Node.js corriendo
- [ ] Email SMTP funcionando
- [ ] Dominio/subdominio configurado
- [ ] SSL/HTTPS activo
- [ ] Prueba de flujo completo realizada

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs (`app.log`)
2. Verifica permisos de archivos
3. Confirma que el puerto no esté bloqueado
4. Contacta soporte de Hostinger si es problema del servidor

**¡Listo para desplegar! 🚀**
