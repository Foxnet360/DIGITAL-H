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
    sendJSON(['error' => 'Metodo no permitido'], 405);
}

// Obtener datos del body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    sendJSON(['error' => 'Datos JSON invalidos'], 400);
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
    sendJSON(['error' => 'Email invalido'], 400);
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

// Calcular dimensión débil
$weakDimension = calculateWeakDimension($answers);

try {
    // Conectar a BD
    $conn = getDBConnection();

    // Preparar y ejecutar insert (sin dimensiones por ahora)
    $stmt = $conn->prepare("
        INSERT INTO digitalh_results 
        (name, email, company, company_size, imd_score, maturity_level, answers_json, gdpr_consent, gdpr_timestamp) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $answersJson = json_encode($answers);
    $gdprDate = $gdprTimestamp ? date('Y-m-d H:i:s', $gdprTimestamp / 1000) : null;
    $gdprValue = $gdprConsent ? 1 : 0;
    
    $stmt->bind_param(
        "ssssissis",
        $name,
        $email,
        $company,
        $size,
        $imd,
        $level,
        $answersJson,
        $gdprValue,
        $gdprDate
    );
    
    $stmt->execute();
    $insertId = $conn->insert_id;
    $stmt->close();
    
    // Registrar en email_sequences si tiene consentimiento GDPR
    $sequenceId = null;
    if ($gdprConsent) {
        $sequenceStmt = $conn->prepare("
            INSERT INTO email_sequences 
            (email, name, company, sequence_type, status, current_step, next_send_at, 
             digitalh_score, digitalh_maturity_level, dimension_weak, gdpr_consent, created_at, updated_at) 
            VALUES (?, ?, ?, 'digital-h', 'active', 1, DATE_ADD(NOW(), INTERVAL 2 DAY), ?, ?, ?, 1, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            company = VALUES(company),
            status = 'active',
            current_step = 1,
            next_send_at = DATE_ADD(NOW(), INTERVAL 2 DAY),
            digitalh_score = VALUES(digitalh_score),
            digitalh_maturity_level = VALUES(digitalh_maturity_level),
            dimension_weak = VALUES(dimension_weak),
            gdpr_consent = 1,
            updated_at = NOW()
        ");
        
        $sequenceStmt->bind_param(
            "sssiss",
            $email,
            $name,
            $company,
            $imd,
            $level,
            $weakDimension
        );
        
        $sequenceStmt->execute();
        $sequenceId = $conn->insert_id;
        $sequenceStmt->close();
    }
    
    $conn->close();
    
    // Enviar email de agradecimiento
    $emailSent = sendThankYouEmail($email, $name, $company, $imd, $level);
    
    sendJSON([
        'success' => true,
        'message' => 'Diagnostico guardado correctamente',
        'id' => $insertId,
        'sequence_id' => $sequenceId,
        'weak_dimension' => $weakDimension,
        'email_sent' => $emailSent
    ]);
    
} catch (Exception $e) {
    error_log("Error en diagnostic.php: " . $e->getMessage());
    sendJSON(['error' => 'Error al guardar el diagnostico', 'debug' => $e->getMessage()], 500);
}
?>
