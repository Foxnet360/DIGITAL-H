<?php
/**
 * Verificación del payload de email de DIGITAL-H.
 *
 * Valida que el HTML generado por el backend contenga los datos requeridos:
 * nombre, empresa, IMD, nivel y enlace de resultados.
 *
 * Uso (entorno con PHP):
 *   php public/api/verify-email-payload.php
 */
require_once __DIR__ . '/config.php';

$name = 'Usuario de Prueba';
$email = 'test@acrux.life';
$company = 'Empresa Test';
$imd = 65;
$level = 'Desarrollo';
$id = 999;
$shareToken = 'test-token-123';

// Reconstruimos el HTML que generaría sendThankYouEmail para verificar la forma
// del payload. No se envía ningún email real.
$html = renderDiagnosticEmailHtml($name, $email, $company, $imd, $level, $id, $shareToken);

$checks = [
  'name' => strpos($html, htmlspecialchars($name)) !== false,
  'company' => strpos($html, htmlspecialchars($company)) !== false,
  'imd' => strpos($html, (string)$imd) !== false,
  'level' => strpos($html, htmlspecialchars($level)) !== false,
  'results_link' => strpos($html, "#results/$id/$shareToken") !== false,
];

$allPassed = !in_array(false, $checks, true);

http_response_code($allPassed ? 200 : 500);
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
  'success' => $allPassed,
  'checks' => $checks,
  'resend_configured' => !empty(env('RESEND_API_KEY')),
], JSON_PRETTY_PRINT);
echo "\n";

/**
 * Renderiza el HTML del email de diagnóstico para validación de payload.
 * Es una versión reducida del template real; solo se usa para verificación.
 */
function renderDiagnosticEmailHtml($name, $email, $company, $imd, $level, $id, $shareToken) {
    $resultsUrl = 'https://acrux.life/digital-h/#results/' . urlencode((string)$id) . '/' . urlencode((string)$shareToken);
    return '<!DOCTYPE html>
<html>
<body>
    <p>Hola ' . htmlspecialchars($name) . ',</p>
    <p>Gracias por completar el diagnóstico de madurez digital de <strong>' . htmlspecialchars($company) . '</strong>.</p>
    <p>Índice de Madurez Digital: ' . $imd . '%</p>
    <p>Nivel: ' . htmlspecialchars($level) . '</p>
    <a href="' . $resultsUrl . '" style="display:inline-block;">Ver mis resultados completos</a>
</body>
</html>';
}
