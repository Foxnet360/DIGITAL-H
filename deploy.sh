#!/bin/bash

# Script de despliegue DIGITAL-H a Hostinger
# Ejecutar desde la raíz del proyecto DIGITAL-H

set -e  # Exit on error

HOST="acrux"
REMOTE_PATH="domains/acrux.life/public_html/digital-h"
DEPLOY_DIR="deploy/digital-h"

echo "🚀 Iniciando despliegue de DIGITAL-H a Hostinger..."

# 1. Build del frontend
echo "📦 Compilando frontend..."
npm run build

# 2. Preparar carpeta de deploy limpia
echo "📁 Preparando archivos para despliegue..."
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# 3. Copiar archivos del build
cp -r dist/* "$DEPLOY_DIR/"

# 4. Copiar APIs PHP
echo "🔧 Copiando archivos PHP de la API..."
mkdir -p "$DEPLOY_DIR/api"
cp public/api/*.php "$DEPLOY_DIR/api/"

# 5. Copiar .htaccess
cp public/.htaccess "$DEPLOY_DIR/"

echo "✅ Archivos listos para subir:"
ls -la "$DEPLOY_DIR/"
echo ""
ls -la "$DEPLOY_DIR/api/"

# 6. Subir a Hostinger
echo ""
echo "📤 Subiendo a Hostinger via rsync..."
rsync -avz --delete \
    -e ssh \
    "$DEPLOY_DIR/" \
    "$HOST:$REMOTE_PATH/"

echo ""
echo "✅ Despliegue completado!"
echo ""
echo "🌐 URLs:"
echo "   Frontend: https://acrux.life/digital-h/"
echo "   API:      https://acrux.life/digital-h/api/diagnostic.php"
echo "   Health:   https://acrux.life/digital-h/api/health.php"
