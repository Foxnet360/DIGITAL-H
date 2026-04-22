<?php
require_once 'config.php';

// Permitir CORS desde acrux.life
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (strpos($origin, 'acrux.life') !== false || $origin === '') {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Responder a preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['error' => 'Método no permitido'], 405);
}

// Obtener datos del body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    sendJSON(['error' => 'Datos JSON inválidos'], 400);
}

// Validar campos requeridos
$required = ['email', 'name', 'company', 'imd', 'level', 'answers'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        sendJSON(['error' => 'Faltan campos requeridos'], 400);
    }
}

// Validar email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    sendJSON(['error' => 'Email inválido'], 400);
}

$email = $data['email'];
$name = $data['name'];
$company = $data['company'];
$size = $data['size'] ?? 'No especificado';
$imd = (int)$data['imd'];
$level = $data['level'];
$answers = $data['answers'];
$gdprConsent = $data['gdprConsent'] ?? false;
$gdprTimestamp = $data['gdprTimestamp'] ?? null;

try {
    // Calcular dimensiones
    $dimensions = calculateDimensions($answers);
    
    // Conectar a BD
    $conn = getDBConnection();
    
    // Preparar y ejecutar insert
    $stmt = $conn->prepare("
        INSERT INTO digitalh_results 
        (name, email, company, company_size, imd_score, maturity_level, answers_json,
         dimension_strategy, dimension_culture, dimension_talent, dimension_tech, 
         dimension_process, dimension_wellbeing, gdpr_consent, gdpr_timestamp) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $answersJson = json_encode($answers);
    $gdprDate = $gdprTimestamp ? date('Y-m-d H:i:s', $gdprTimestamp / 1000) : null;
    
    $stmt->bind_param(
        "ssssissddddddis",
        $name,
        $email,
        $company,
        $size,
        $imd,
        $level,
        $answersJson,
        $dimensions['strategy'],
        $dimensions['culture'],
        $dimensions['talent'],
        $dimensions['tech'],
        $dimensions['process'],
        $dimensions['wellbeing'],
        $gdprConsent ? 1 : 0,
        $gdprDate
    );
    
    $stmt->execute();
    $insertId = $conn->insert_id;
    $stmt->close();
    $conn->close();
    
    // Enviar email de agradecimiento
    $emailSent = sendThankYouEmail($email, $name, $company, $imd, $level);
    
    sendJSON([
        'success' => true,
        'message' => 'Diagnóstico guardado correctamente',
        'id' => $insertId,
        'email_sent' => $emailSent
    ]);
    
} catch (Exception $e) {
    error_log("Error en diagnostic.php: " . $e->getMessage());
    sendJSON(['error' => 'Error al guardar el diagnóstico'], 500);
}
?>
