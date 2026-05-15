# Plan de Mejora de Despliegue - Ecosistema acrux.life

## Incidente
**Fecha:** 2026-05-04
**Problema:** DIGITAL-H fue desplegado incorrectamente en la ruta `/pulso-h-beta/` en lugar de `/digital-h/`, sobrescribiendo temporalmente el contenido de PULSO-H-BETA.

## Estado Actual (Corregido)
- ✅ DIGITAL-H: `https://acrux.life/digital-h/`
- ✅ PULSO-H: `https://acrux.life/pulso-h/`
- ✅ PULSO-H-BETA: `https://acrux.life/pulso-h-beta/` (restaurado)

---

## Causas Raíz

1. **Configuración incorrecta en `deploy.sh`**: `REMOTE_PATH` apuntaba a `pulso-h-beta` en lugar de `digital-h`
2. **Falta de validación**: No se verificó la ruta destino antes del despliegue
3. **Mezcla de proyectos**: El script no valida que no se esté sobrescribiendo otro proyecto

---

## Mejoras Implementadas

### 1. Corrección Inmediata
- [x] Corregido `deploy.sh` para apuntar a `domains/acrux.life/public_html/digital-h`
- [x] Corregido `.htaccess` con `RewriteBase /digital-h/`
- [x] Limpiado `pulso-h-beta` y restaurado desde `pulso-h`
- [x] Eliminada carpeta anidada `digital-h/digital-h/`
- [x] Verificado funcionamiento de APIs y frontend

### 2. Prevención de Errores Futuros

#### A. Validación Pre-Deploy
```bash
# Antes de deploy, verificar:
1. REMOTE_PATH coincide con el proyecto
2. La ruta destino no contiene otro proyecto activo
3. Backup disponible antes de sobrescribir
```

#### B. Estructura de Proyectos (Convención)
```
acrux.life/public_html/
├── (root)           → Landing page principal acrux.life
├── digital-h/       → DIGITAL-H (lead magnet madurez digital)
├── pulso-h/         → PULSO-H (lead magnet bienestar laboral)
├── pulso-h-beta/    → PULSO-H staging (solo si es necesario)
└── [futuros-proyectos]/  → Nuevos lead magnets
```

#### C. Convención de Nombres
- **Producción:** `/[nombre-proyecto]/`
- **Staging/Beta:** `/[nombre-proyecto]-beta/` (opcional)
- **Nunca mezclar proyectos en la misma carpeta**

### 3. Script de Deploy Mejorado

#### Características:
- ✅ Validación de ruta destino
- ✅ Confirmación antes de sobrescribir
- ✅ Backup automático antes de deploy
- ✅ Verificación post-deploy
- ✅ Rollback automático si falla

#### Uso:
```bash
# Desplegar DIGITAL-H a producción
./deploy.sh

# Desplegar a staging (si aplica)
./deploy-staging.sh
```

### 4. Checklist Pre-Deploy Obligatorio

- [ ] Verificar que `REMOTE_PATH` es correcto para el proyecto
- [ ] Confirmar que no se sobrescribirá otro proyecto
- [ ] Ejecutar tests: `npm run test:run`
- [ ] Build exitoso: `npm run build`
- [ ] Verificar API health: `curl /api/health.php`
- [ ] Backup creado (automático en script)

---

## Métricas de Monitoreo

### APIs de Health Check
- DIGITAL-H: `https://acrux.life/digital-h/api/health.php`
- PULSO-H: `https://acrux.life/pulso-h/api/health.php` (si aplica)

### Eventos a Trackear
- Deploy exitoso/fallido
- Tiempo de deploy
- Proyecto afectado
- Usuario que realizó el deploy

---

## Lecciones Aprendidas

1. **Nunca asumir la ruta de deploy** - Siempre verificar `REMOTE_PATH`
2. **Staging y producción deben estar separados físicamente**
3. **Backup antes de cualquier deploy** - Aunque sea "solo un fix rápido"
4. **Validar post-deploy** - Siempre probar las URLs después de deployar
5. **Documentar la estructura** - Mantener este documento actualizado

---

## Próximos Pasos

1. [ ] Implementar script de deploy con validaciones (versión 2)
2. [ ] Agregar CI/CD con GitHub Actions para deploy automatizado
3. [ ] Configurar monitoreo de uptime para todos los proyectos
4. [ ] Documentar proceso de rollback en caso de emergencia
5. [ ] Crear inventario de todos los proyectos del ecosistema

---

## Contacto

Para dudas sobre despliegue:
- Revisar este documento
- Verificar `deploy.sh` y `.htaccess`
- Consultar con el equipo de desarrollo

**Última actualización:** 2026-05-04
**Responsable:** Equipo de Desarrollo ACRUX
