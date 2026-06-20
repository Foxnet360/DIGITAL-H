<?php
require_once 'config.php';

// Permitir CORS desde acrux.life
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (strpos($origin, 'acrux.life') !== false || $origin === '') {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Responder a preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Handler para GET (consultar diagnóstico por ID y token de forma segura)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    $token = isset($_GET['token']) ? trim($_GET['token']) : '';
    
    if (!$id || !$token) {
        sendJSON(['error' => 'ID o Token faltante o invalido'], 400);
    }
    
    try {
        $conn = getDBConnection();
        
        // Primero verificar si existe el registro para poder retornar 404 o 403 adecuadamente
        $stmtCheck = $conn->prepare("SELECT id FROM digitalh_results WHERE id = ?");
        $stmtCheck->bind_param("i", $id);
        $stmtCheck->execute();
        $resultCheck = $stmtCheck->get_result();
        $exists = $resultCheck->num_rows > 0;
        $stmtCheck->close();
        
        if (!$exists) {
            $conn->close();
            sendJSON(['error' => 'Resultado no encontrado'], 404);
        }
        
        // Consultar con token
        $stmt = $conn->prepare("
            SELECT name, company, imd_score, maturity_level, answers_json, share_token 
            FROM digitalh_results 
            WHERE id = ? AND share_token = ?
        ");
        if (!$stmt) {
            $conn->close();
            sendJSON(['error' => 'Error al preparar consulta'], 500);
        }
        $stmt->bind_param("is", $id, $token);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        $conn->close();
        
        if (!$row) {
            sendJSON(['error' => 'Token de acceso no valido'], 403);
        }
        
        // Decodificar answers_json
        $answers = json_decode($row['answers_json'], true);
        
        sendJSON([
            'name' => $row['name'],
            'company' => $row['company'],
            'imd_score' => (int)$row['imd_score'],
            'maturity_level' => $row['maturity_level'],
            'answers_json' => $answers,
            'share_token' => $row['share_token']
        ]);
        
    } catch (Exception $e) {
        error_log("Error en diagnostic.php GET: " . $e->getMessage());
        sendJSON(['error' => 'Error al consultar el diagnostico', 'debug' => $e->getMessage()], 500);
    }
    exit;
}

// Solo aceptar POST para creación
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

// Generar share token UUID v4
$shareToken = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
    mt_rand(0, 0xffff), mt_rand(0, 0xffff),
    mt_rand(0, 0xffff),
    mt_rand(0, 0x0fff) | 0x4000,
    mt_rand(0, 0x3fff) | 0x8000,
    mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
);

try {
    // Conectar a BD
    $conn = getDBConnection();

    // Preparar y ejecutar insert (sin dimensiones por ahora)
    $stmt = $conn->prepare("
        INSERT INTO digitalh_results 
        (share_token, name, email, company, company_size, imd_score, maturity_level, answers_json, gdpr_consent, gdpr_timestamp) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $answersJson = json_encode($answers);
    $gdprDate = $gdprTimestamp ? date('Y-m-d H:i:s', $gdprTimestamp / 1000) : null;
    $gdprValue = $gdprConsent ? 1 : 0;
    
    $stmt->bind_param(
        "sssssissis",
        $shareToken,
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
    $conn->close();
    
    // Enviar email de agradecimiento
    $emailSent = sendThankYouEmail($email, $name, $company, $imd, $level, $insertId, $shareToken);
    
    sendJSON([
        'success' => true,
        'message' => 'Diagnostico guardado correctamente',
        'id' => $insertId,
        'share_token' => $shareToken,
        'email_sent' => $emailSent
    ]);
    
} catch (Exception $e) {
    error_log("Error en diagnostic.php: " . $e->getMessage());
    sendJSON(['error' => 'Error al guardar el diagnostico', 'debug' => $e->getMessage()], 500);
}
?>
