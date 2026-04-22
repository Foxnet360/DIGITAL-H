#!/bin/bash

# Script de despliegue DIGITAL-H a Hostinger
# Ejecutar desde la raíz del proyecto

echo "🚀 Iniciando despliegue de DIGITAL-H a Hostinger..."

# 1. Build del frontend
echo "📦 Compilando frontend..."
npm run build

# 2. Copiar archivos al directorio de despliegue
echo "📁 Preparando archivos para subir..."
rm -rf public/digital-h/*
cp -r dist/* public/digital-h/

# 3. Copiar archivos PHP de la API
echo "🔧 Copiando archivos PHP de la API..."
cp -r public/digital-h/api/* public/digital-h/api/ 2>/dev/null || true

# 4. Verificar estructura
echo "✅ Archivos listos para subir:"
ls -la public/digital-h/

echo ""
echo "📝 Para subir a Hostinger, ejecuta:"
echo "   scp -P 65002 -r public/digital-h/* u554044004@82.197.80.180:~/domains/acrux.life/public_html/digital-h/"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   1. Asegúrate de que la carpeta ~/domains/acrux.life/public_html/digital-h/ exista"
echo "   2. Verifica que la tabla digitalh_results exista en tu BD MySQL"
echo "   3. Configura las variables de entorno en el archivo .env o en el panel de Hostinger"
echo ""
echo "🌐 URLs después del despliegue:"
echo "   Frontend: https://acrux.life/digital-h/"
echo "   API:      https://acrux.life/digital-h/api/diagnostic.php"
echo "   Health:   https://acrux.life/digital-h/api/health.php"
