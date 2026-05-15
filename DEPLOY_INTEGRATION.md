# Guía de Despliegue - Integración DIGITAL-H con Email Nurturing

## Resumen

Este documento describe los pasos para desplegar la integración de DIGITAL-H con el sistema de email nurturing de acrux.life.

## Cambios Realizados

### 1. `public/digital-h/api/diagnostic.php`
- ✅ Calcula dimensión débil (`calculateWeakDimension()`)
- ✅ Registra leads en `email_sequences` con GDPR check
- ✅ Usa PHPMailer para enviar Day 0 email
- ✅ Retorna `sequence_id` y `weak_dimension` en la respuesta

### 2. `public/digital-h/api/config.php`
- ✅ Carga configuración desde acrux.life (`database/config.php`)
- ✅ Elimina credenciales hardcodeadas duplicadas
- ✅ Implementa `sendThankYouEmail()` con PHPMailer
- ✅ Fallback a `mail()` nativo si PHPMailer no está disponible
- ✅ Mantiene funciones helper (`sendJSON`, `calculateDimensions`)

## Pre-Despliegue (Verificación)

### 1. Verificar Tablas en Base de Datos
```sql
-- Verificar que las tablas existen
SHOW TABLES LIKE 'email_sequences';
SHOW TABLES LIKE 'email_logs';
SHOW TABLES LIKE 'email_templates';

-- Verificar que hay templates
SELECT COUNT(*) FROM email_templates WHERE sequence_type = 'digital-h';
```

### 2. Verificar PHPMailer
```bash
# Verificar que PHPMailer está instalado
ls -la /home/u554044004/domains/acrux.life/database/vendor/phpmailer
# o
ls -la /home/u554044004/domains/acrux.life/vendor/phpmailer
```

### 3. Verificar Configuración de acrux.life
```bash
# Verificar que config.php existe y tiene credenciales válidas
cat /home/u554044004/domains/acrux.life/database/config.php
```

## Despliegue

### Paso 1: Backup
```bash
# Crear backup de archivos existentes
cp public/digital-h/api/diagnostic.php public/digital-h/api/diagnostic.php.bak.$(date +%Y%m%d)
cp public/digital-h/api/config.php public/digital-h/api/config.php.bak.$(date +%Y%m%d)
```

### Paso 2: Subir Archivos Modificados
Subir a producción:
- `public/digital-h/api/diagnostic.php`
- `public/digital-h/api/config.php`

**IMPORTANTE**: No sobrescribir `.htaccess`

### Paso 3: Verificar Permisos
```bash
chmod 644 public/digital-h/api/diagnostic.php
chmod 644 public/digital-h/api/config.php
```

### Paso 4: Configurar Cron Job en Hostinger

1. Ingresar a hPanel → Advanced → Cron Jobs
2. Crear nuevo cron job:
   - **Frequency**: Daily at 9:00 AM
   - **Command**: 
   ```bash
   php /home/u554044004/domains/acrux.life/database/email_sender.php >> /home/u554044004/domains/acrux.life/logs/email_cron.log 2>&1
   ```

### Paso 5: Crear Directorio de Logs (si no existe)
```bash
mkdir -p /home/u554044004/domains/acrux.life/logs
chmod 755 /home/u554044004/domains/acrux.life/logs
```

## Testing

### Test 1: Diagnóstico con GDPR Consent
```bash
curl -X POST https://acrux.life/digital-h/api/diagnostic.php \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Company",
    "size": "51-250",
    "imd": 72,
    "level": "Avanzado",
    "answers": {"E1.1": 4, "E1.2": 5, "C2.1": 3, "T3.1": 4, "I4.1": 2, "P5.1": 5, "B6.1": 4},
    "gdprConsent": true,
    "gdprTimestamp": 1713456000000
  }'
```

**Verificar**:
- ✅ Respuesta exitosa con `sequence_id`
- ✅ Registro en `digitalh_results`
- ✅ Registro en `email_sequences` con `current_step=1`
- ✅ Email Day 0 recibido
- ✅ `next_send_at` = hoy + 2 días

### Test 2: Diagnóstico sin GDPR Consent
```bash
curl -X POST https://acrux.life/digital-h/api/diagnostic.php \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User 2",
    "email": "test2@example.com",
    "company": "Test Company 2",
    "imd": 45,
    "level": "Inicial",
    "answers": {"E1.1": 2, "C2.1": 3},
    "gdprConsent": false
  }'
```

**Verificar**:
- ✅ Respuesta exitosa pero sin `sequence_id`
- ✅ Registro en `digitalh_results`
- ✅ NO hay registro en `email_sequences`

### Test 3: Email Nurturing (Manual)
```bash
# Ejecutar email_sender manualmente para test
php /home/u554044004/domains/acrux.life/database/email_sender.php --dry-run
```

## Rollback

Si algo sale mal:

```bash
# Restaurar backups
cp public/digital-h/api/diagnostic.php.bak.20240124 public/digital-h/api/diagnostic.php
cp public/digital-h/api/config.php.bak.20240124 public/digital-h/api/config.php

# Eliminar registros de prueba
mysql -u u554044004_acruxuser -p u554044004_acruxdb -e "DELETE FROM email_sequences WHERE email LIKE 'test%';"
```

## Monitoreo

### Logs Importantes
- `/home/u554044004/domains/acrux.life/logs/email_sender.log` - Log del sender
- `/home/u554044004/domains/acrux.life/logs/email_cron.log` - Log del cron

### Queries de Verificación
```sql
-- Verificar secuencias activas
SELECT email, current_step, next_send_at, digitalh_maturity_level, dimension_weak 
FROM email_sequences 
WHERE status = 'active' 
ORDER BY next_send_at;

-- Verificar emails enviados
SELECT sequence_id, step_number, status, sent_at 
FROM email_logs 
ORDER BY sent_at DESC 
LIMIT 20;

-- Verificar errores
SELECT sequence_id, step_number, status, sent_at 
FROM email_logs 
WHERE status = 'failed' 
ORDER BY sent_at DESC;
```

## Notas

- La integración reutiliza la configuración de acrux.life para evitar credenciales duplicadas
- Si PHPMailer no está disponible, usa fallback a `mail()` nativo
- El cron job debe ejecutarse diariamente para enviar emails de nurturing
- `.htaccess` no se modifica en este despliegue
