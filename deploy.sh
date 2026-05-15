#!/bin/bash

# =============================================================================
# Script de Despliegue DIGITAL-H - Ecosistema Acrux.life
# =============================================================================
# Este script garantiza un despliegue seguro y correcto del lead magnet
# DIGITAL-H, preservando la integridad del ecosistema acrux.life
# =============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuración
HOST="acrux"
PROJECT_NAME="DIGITAL-H"
DEFAULT_PATH="domains/acrux.life/public_html/digital-h"
DEPLOY_DIR="deploy/digital-h"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          DEPLOY - DIGITAL-H by Acrux Consultores              ║"
echo "║              Ecosistema de Madurez Digital                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# =============================================================================
# PASO 1: DETECCIÓN AUTOMÁTICA DEL CONTEXTO
# =============================================================================

echo -e "${YELLOW}🔍 Detectando contexto del proyecto...${NC}"

# Verificar si estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encontró package.json${NC}"
    echo -e "${RED}   Debes ejecutar este script desde la raíz del proyecto DIGITAL-H${NC}"
    exit 1
fi

# Verificar que es DIGITAL-H y no PULSO-H
if grep -q '"name":.*pulso"' package.json 2>/dev/null || [ -f "src/components/PulsoLanding.tsx" ]; then
    echo -e "${RED}❌ ERROR: Este parece ser el proyecto PULSO-H, no DIGITAL-H${NC}"
    echo -e "${RED}   Verifica que estás en la carpeta correcta${NC}"
    exit 1
fi

# Detectar nombre del proyecto
if grep -q '"name":.*digital-h\|digitalh\|digital_h"' package.json 2>/dev/null; then
    PROJECT_NAME="DIGITAL-H"
    echo -e "${GREEN}✅ Proyecto detectado: DIGITAL-H${NC}"
else
    echo -e "${YELLOW}⚠️  No se pudo detectar automáticamente el proyecto${NC}"
    echo -e "${YELLOW}   Asumiendo DIGITAL-H por defecto${NC}"
fi

# =============================================================================
# PASO 2: SELECCIÓN DEL AMBIENTE
# =============================================================================

echo ""
echo -e "${YELLOW}📍 Selecciona el ambiente de despliegue:${NC}"
echo ""
echo "   [1] Producción  → https://acrux.life/digital-h/"
echo "   [2] Staging     → https://acrux.life/digital-h-beta/ (si existe)"
echo "   [3] Cancelar"
echo ""
read -p "Opción (1-3): " AMBIENTE

case $AMBIENTE in
    1)
        DEPLOY_TARGET="producción"
        REMOTE_PATH="$DEFAULT_PATH"
        REWRITE_BASE="/digital-h/"
        URL="https://acrux.life/digital-h/"
        ;;
    2)
        DEPLOY_TARGET="staging"
        REMOTE_PATH="domains/acrux.life/public_html/digital-h-beta"
        REWRITE_BASE="/digital-h-beta/"
        URL="https://acrux.life/digital-h-beta/"
        echo -e "${YELLOW}⚠️  Nota: El ambiente de staging debe existir previamente${NC}"
        ;;
    3)
        echo -e "${YELLOW}⚠️  Despliegue cancelado${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Opción inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎯 Ambiente seleccionado: $DEPLOY_TARGET${NC}"
echo -e "${GREEN}🌐 URL: $URL${NC}"
echo -e "${GREEN}📂 Ruta remota: $REMOTE_PATH${NC}"

# =============================================================================
# PASO 3: VALIDACIONES CRÍTICAS
# =============================================================================

echo ""
echo -e "${YELLOW}🔒 Validaciones de seguridad...${NC}"

# 3.1: Verificar que no sobrescribimos PULSO-H
if [[ "$REMOTE_PATH" == *"pulso"* ]]; then
    echo -e "${RED}❌ ERROR CRÍTICO: La ruta contiene 'pulso'${NC}"
    echo -e "${RED}   Esto sobrescribiría PULSO-H${NC}"
    exit 1
fi

# 3.2: Verificar conexión SSH
echo -e "${YELLOW}   Verificando conexión SSH...${NC}"
if ! ssh -p 65002 -o ConnectTimeout=5 $HOST "echo 'OK'" > /dev/null 2>&1; then
    echo -e "${RED}❌ No se puede conectar al servidor${NC}"
    echo -e "${RED}   Verifica tu configuración SSH${NC}"
    exit 1
fi
echo -e "${GREEN}   ✅ Conexión SSH OK${NC}"

# 3.3: Verificar ruta remota
echo -e "${YELLOW}   Verificando ruta remota...${NC}"
REMOTE_EXISTS=$(ssh -p 65002 $HOST "test -d ~/domains/acrux.life/public_html/digital-h && echo 'EXISTS' || echo 'NEW'")

if [ "$REMOTE_EXISTS" = "EXISTS" ] && [ "$DEPLOY_TARGET" = "producción" ]; then
    echo -e "${YELLOW}   ⚠️  La ruta ya existe en producción${NC}"
    
    # Verificar que es DIGITAL-H y no otro proyecto
    IS_DIGITAL_H=$(ssh -p 65002 $HOST "grep -q 'DIGITAL-H\|digital-h\|Diagnóstico de Madurez Digital' ~/domains/acrux.life/public_html/digital-h/index.html 2>/dev/null && echo 'YES' || echo 'NO'")
    
    if [ "$IS_DIGITAL_H" = "NO" ]; then
        echo -e "${RED}   ❌ ERROR: La ruta existe pero NO contiene DIGITAL-H${NC}"
        echo -e "${RED}      Podría contener otro proyecto${NC}"
        
        echo ""
        read -p "¿Quieres ver el contenido actual? (yes/no): " VIEW_CONTENT
        if [ "$VIEW_CONTENT" = "yes" ]; then
            ssh -p 65002 $HOST "ls -la ~/domains/acrux.life/public_html/digital-h/ | head -15"
        fi
        
        echo ""
        echo -e "${RED}❌ Despliegue abortado para prevenir daños${NC}"
        exit 1
    else
        echo -e "${GREEN}   ✅ La ruta contiene DIGITAL-H (actualización)${NC}"
    fi
else
    echo -e "${GREEN}   ✅ Nueva instalación${NC}"
fi

# =============================================================================
# PASO 4: BACKUP AUTOMÁTICO
# =============================================================================

echo ""
echo -e "${YELLOW}💾 Creando backup automático...${NC}"

BACKUP_NAME="backup_digital-h_${TIMESTAMP}"

ssh -p 65002 $HOST "
    if [ -d ~/domains/acrux.life/public_html/digital-h ] && [ \"\$(ls -A ~/domains/acrux.life/public_html/digital-h/ 2>/dev/null | wc -l)\" -gt 0 ]; then
        cp -r ~/domains/acrux.life/public_html/digital-h ~/domains/acrux.life/public_html/${BACKUP_NAME}
        echo '${BACKUP_NAME}'
    else
        echo 'NO_BACKUP_NEEDED'
    fi
" > /tmp/backup_result.txt

BACKUP_RESULT=$(cat /tmp/backup_result.txt)

if [ "$BACKUP_RESULT" = "NO_BACKUP_NEEDED" ]; then
    echo -e "${GREEN}   ℹ️  No hay contenido previo para backup${NC}"
else
    echo -e "${GREEN}   ✅ Backup creado: ${BACKUP_RESULT}${NC}"
    echo -e "${BLUE}   📂 Ubicación: ~/domains/acrux.life/public_html/${BACKUP_RESULT}${NC}"
fi

# =============================================================================
# PASO 5: VERIFICAR .HTACCESS
# =============================================================================

echo ""
echo -e "${YELLOW}🔧 Verificando .htaccess...${NC}"

if [ ! -f "public/.htaccess" ]; then
    echo -e "${RED}❌ Error: No se encontró public/.htaccess${NC}"
    exit 1
fi

# Verificar que RewriteBase es correcto
CURRENT_REWRITE_BASE=$(grep "RewriteBase" public/.htaccess | awk '{print $2}' || echo "NOT_FOUND")

if [ "$CURRENT_REWRITE_BASE" != "$REWRITE_BASE" ]; then
    echo -e "${YELLOW}   ⚠️  RewriteBase actual: $CURRENT_REWRITE_BASE${NC}"
    echo -e "${YELLOW}   📝 Requerido: $REWRITE_BASE${NC}"
    echo -e "${YELLOW}   Corrigiendo automáticamente...${NC}"
    
    # Crear copia de seguridad
    cp public/.htaccess public/.htaccess.bak
    
    # Corregir
    sed -i "s|RewriteBase .*|RewriteBase ${REWRITE_BASE}|" public/.htaccess
    
    echo -e "${GREEN}   ✅ .htaccess corregido${NC}"
    echo -e "${BLUE}   💡 Backup local: public/.htaccess.bak${NC}"
else
    echo -e "${GREEN}   ✅ .htaccess correcto${NC}"
fi

# =============================================================================
# PASO 6: CONFIRMACIÓN FINAL
# =============================================================================

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📋 RESUMEN DEL DESPLIEGUE:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "   Proyecto:     ${GREEN}${PROJECT_NAME}${NC}"
echo -e "   Ambiente:     ${GREEN}${DEPLOY_TARGET}${NC}"
echo -e "   URL:          ${GREEN}${URL}${NC}"
echo -e "   Ruta:         ${GREEN}${REMOTE_PATH}${NC}"
echo -e "   RewriteBase:  ${GREEN}${REWRITE_BASE}${NC}"
if [ "$BACKUP_RESULT" != "NO_BACKUP_NEEDED" ]; then
    echo -e "   Backup:       ${GREEN}${BACKUP_RESULT}${NC}"
fi
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

read -p "¿Confirmar despliegue? Escribe 'DEPLOY' para continuar: " CONFIRM

if [ "$CONFIRM" != "DEPLOY" ]; then
    echo -e "${YELLOW}⚠️  Despliegue cancelado${NC}"
    
    # Restaurar .htaccess si se modificó
    if [ -f "public/.htaccess.bak" ]; then
        mv public/.htaccess.bak public/.htaccess
        echo -e "${BLUE}💡 .htaccess restaurado${NC}"
    fi
    
    exit 0
fi

# =============================================================================
# PASO 7: BUILD DEL FRONTEND
# =============================================================================

echo ""
echo -e "${YELLOW}📦 Compilando frontend...${NC}"

# Limpiar build anterior
rm -rf dist/

# Build
if npm run build; then
    echo -e "${GREEN}✅ Build exitoso${NC}"
else
    echo -e "${RED}❌ Error en el build${NC}"
    exit 1
fi

# =============================================================================
# PASO 8: PREPARAR ARCHIVOS PARA DEPLOY
# =============================================================================

echo -e "${YELLOW}📁 Preparando archivos...${NC}"

# Limpiar directorio de deploy
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copiar archivos del build
cp -r dist/* "$DEPLOY_DIR/"

# Copiar APIs PHP
mkdir -p "$DEPLOY_DIR/api"
if [ -d "public/api" ]; then
    cp public/api/*.php "$DEPLOY_DIR/api/"
    echo -e "${GREEN}   ✅ APIs PHP copiadas${NC}"
fi

# Copiar .htaccess
cp public/.htaccess "$DEPLOY_DIR/"

# Limpiar posibles carpetas anidadas
if [ -d "$DEPLOY_DIR/digital-h" ]; then
    echo -e "${YELLOW}   🧹 Eliminando carpeta anidada digital-h/...${NC}"
    rm -rf "$DEPLOY_DIR/digital-h"
fi

# Verificar estructura
echo -e "${GREEN}   ✅ Archivos listos:${NC}"
ls -la "$DEPLOY_DIR/"

# =============================================================================
# PASO 9: DESPLIEGUE AL SERVIDOR
# =============================================================================

echo ""
echo -e "${YELLOW}🚀 Desplegando a Hostinger...${NC}"

rsync -avz --delete \
    -e "ssh -p 65002" \
    "$DEPLOY_DIR/" \
    "$HOST:$REMOTE_PATH/"

echo -e "${GREEN}✅ Archivos transferidos${NC}"

# =============================================================================
# PASO 10: VERIFICACIÓN POST-DEPLOY
# =============================================================================

echo ""
echo -e "${YELLOW}🔍 Verificando despliegue...${NC}"

# Verificar index.html
if ssh -p 65002 $HOST "test -f ~/domains/acrux.life/public_html/digital-h/index.html"; then
    echo -e "${GREEN}   ✅ index.html encontrado${NC}"
else
    echo -e "${RED}   ❌ index.html NO encontrado${NC}"
fi

# Verificar API
HEALTH_RESPONSE=$(curl -s "${URL}api/health.php" 2>/dev/null || echo "FAILED")
if echo "$HEALTH_RESPONSE" | grep -q '"status":"ok"'; then
    echo -e "${GREEN}   ✅ API respondiendo correctamente${NC}"
else
    echo -e "${YELLOW}   ⚠️  API no responde (puede ser normal si no tiene health.php)${NC}"
fi

# Verificar que no afectamos PULSO-H
if ssh -p 65002 $HOST "test -d ~/domains/acrux.life/public_html/pulso-h"; then
    echo -e "${GREEN}   ✅ PULSO-H intacto${NC}"
else
    echo -e "${YELLOW}   ⚠️  PULSO-H no encontrado (puede ser normal si no existe)${NC}"
fi

# =============================================================================
# RESUMEN FINAL
# =============================================================================

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║               DESPLIEGUE COMPLETADO ✅                          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 URLs:${NC}"
echo -e "   ${GREEN}Frontend:${NC} $URL"
echo -e "   ${GREEN}API:${NC}      ${URL}api/diagnostic.php"
echo -e "   ${GREEN}Health:${NC}   ${URL}api/health.php"
echo ""
echo -e "${YELLOW}📋 Notas:${NC}"
echo -e "   • Si necesitas rollback: ${BACKUP_RESULT}"
echo -e "   • Para ver logs: ssh -p 65002 $HOST"
echo -e "   • Verifica que PULSO-H sigue funcionando: https://acrux.life/pulso-h/"
echo ""
echo -e "${BLUE}✨ DIGITAL-H - Ecosistema Acrux.life${NC}"

# Limpiar archivos temporales
rm -f /tmp/backup_result.txt
rm -f public/.htaccess.bak

exit 0
