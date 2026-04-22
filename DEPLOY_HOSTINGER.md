# 🚀 Despliegue DIGITAL-H en Hostinger (PHP + Frontend Estático)

## Estructura del Despliegue

```
domains/acrux.life/public_html/digital-h/
├── index.html              ← Frontend compilado (React)
├── assets/                 ← CSS, JS, imágenes compiladas
├── api/
│   ├── config.php          ← Configuración BD y SMTP
│   ├── diagnostic.php      ← Guardar diagnósticos + enviar email
│   └── health.php          ← Verificar conexión a BD
├── .htaccess               ← Configuración Apache (CORS, HTTPS)
└── acrux_logo.svg          ← Logo de Acrux
```

## URLs

- **Frontend**: `https://acrux.life/digital-h/`
- **API Diagnóstico**: `https://acrux.life/digital-h/api/diagnostic.php`
- **Health Check**: `https://acrux.life/digital-h/api/health.php`

## Instrucciones de Despliegue

### Paso 1: Verificar Base de Datos

Asegúrate de que la tabla `digitalh_results` exista en tu BD MySQL:

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

### Paso 2: Configurar Variables de Entorno

Opción A - Usar el archivo `.env` existente (ya está configurado)

Opción B - Configurar en el panel de Hostinger:
1. Ve a "Advanced" → "Environment Variables" en tu panel
2. Configura estas variables:
   - `DB_HOST=localhost`
   - `DB_USER=u554044004_acruxuser`
   - `DB_PASSWORD=4Crux2026*`
   - `DB_NAME=u554044004_acruxdb`
   - `SMTP_HOST=smtp.hostinger.com`
   - `SMTP_PORT=465`
   - `SMTP_SECURE=true`
   - `SMTP_USER=hola@acrux.life`
   - `SMTP_PASS=4Crux2026*`
   - `SMTP_FROM=DIGITAL-H <hola@acrux.life>`

### Paso 3: Subir Archivos

#### Opción A: SCP (SSH)
```bash
# Desde tu computadora (en la carpeta del proyecto)
scp -P 65002 -r public/digital-h/* u554044004@82.197.80.180:~/domains/acrux.life/public_html/digital-h/
```

#### Opción B: FTP/SFTP
1. Conecta por FTP al servidor
2. Navega a `domains/acrux.life/public_html/digital-h/`
3. Sube todos los archivos de la carpeta `public/digital-h/`

#### Opción C: GitHub Actions (Automático)
Si tienes GitHub Actions configurado para acrux.life, puedes agregar un paso adicional para copiar DIGITAL-H.

### Paso 4: Verificar Despliegue

1. **Health Check**:
   ```bash
   curl https://acrux.life/digital-h/api/health.php
   ```
   Debe responder: `{"status":"ok","database":"connected"}`

2. **Frontend**:
   Abre `https://acrux.life/digital-h/` en tu navegador

3. **Test Completo**:
   - Completa un diagnóstico de prueba
   - Verifica que se guarde en la BD
   - Revisa que llegue el email de agradecimiento

## Solución de Problemas

### Error 500 (Internal Server Error)
1. Verifica permisos de archivos:
   ```bash
   chmod 755 ~/domains/acrux.life/public_html/digital-h/
   chmod 644 ~/domains/acrux.life/public_html/digital-h/api/*.php
   ```

2. Revisa logs de errores en Hostinger:
   - Ve a "Advanced" → "Error Logs" en tu panel

### Error de CORS
Verifica que el `.htaccess` esté correctamente subido y que el módulo `mod_headers` esté activo.

### Error de Conexión a BD
1. Verifica credenciales en `api/config.php` o variables de entorno
2. Confirma que el usuario MySQL tiene acceso desde localhost
3. Verifica que la tabla `digitalh_results` existe

### Emails No Llegan
1. Verifica configuración SMTP en el panel de Hostinger
2. Revisa la carpeta de spam
3. Confirma que el dominio `acrux.life` tiene SPF/DKIM configurados

## Actualizaciones Futuras

Para actualizar DIGITAL-H después de cambios:

```bash
# 1. Compilar frontend
npm run build

# 2. Copiar al directorio de despliegue
cp -r dist/* public/digital-h/

# 3. Subir a Hostinger
scp -P 65002 -r public/digital-h/* u554044004@82.197.80.180:~/domains/acrux.life/public_html/digital-h/
```

## Notas Importantes

- ✅ **No necesitas Node.js en el servidor** - todo el backend está en PHP
- ✅ **Frontend es estático** - solo HTML/CSS/JS compilados
- ✅ **APIs en PHP** - usan la BD MySQL de Hostinger
- ✅ **Emails vía SMTP** - usando la configuración de Hostinger
- ⚠️ **Variables de entorno** - deben estar configuradas en el servidor
