<?php
// Script de prueba para verificar envío de emails
require_once 'config.php';

// Verificar si mail() está disponible
echo "Verificando funciones de email...\n";
echo "mail() existe: " . (function_exists('mail') ? 'SI' : 'NO') . "\n\n";

// Datos de prueba
$testEmail = isset($_GET['email']) ? $_GET['email'] : 'hola@acrux.life';
$testName = 'Usuario de Prueba';
$testCompany = 'Empresa Test';
$testIMD = 65;
$testLevel = 'Desarrollo';

echo "Enviando email de prueba a: $testEmail\n";
echo "----------------------------------------\n";

// Intentar enviar
$result = sendThankYouEmail($testEmail, $testName, $testCompany, $testIMD, $testLevel);

if ($result) {
    echo "✅ Email enviado correctamente\n";
    echo "Revisa tu bandeja de entrada (y spam/correo no deseado)\n";
} else {
    echo "❌ Error al enviar email\n";
    echo "Posibles causas:\n";
    echo "- La función mail() no está habilitada\n";
    echo "- El servidor SMTP no responde\n";
    echo "- Las credenciales son incorrectas\n";
}

echo "\n----------------------------------------\n";
echo "Información del servidor:\n";
echo "PHP Version: " . phpversion() . "\n";
echo "SMTP Configurado: " . (ini_get('SMTP') ?: 'No configurado') . "\n";
echo "SMTP Port: " . (ini_get('smtp_port') ?: 'No configurado') . "\n";
?>
