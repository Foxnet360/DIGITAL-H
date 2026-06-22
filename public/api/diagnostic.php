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
$marketingConsent = $data['marketingConsent'] ?? $data['marketing_consent'] ?? true;

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
    
    // Registrar en nurturing unificado y enviar Email 1 si hay consentimiento GDPR y marketing
    $sequenceId = null;
    $email1Sent = false;
    if ($gdprConsent) {
        $pdo = getPDOConnection();
        if ($pdo) {
            try {
                $sequenceId = insertEmailSequence($pdo, [
                    'email' => $email,
                    'name' => $name,
                    'company' => $company,
                    'score' => $imd,
                    'level' => $level,
                    'answers' => $answers,
                    'gdpr_consent' => $gdprConsent,
                    'marketing_consent' => $marketingConsent,
                ]);
                
                if ($sequenceId && $marketingConsent) {
                    $email1Sent = sendEmail1([
                        'email' => $email,
                        'name' => $name,
                        'company' => $company,
                        'score' => $imd,
                        'level' => $level,
                        'id' => $insertId,
                        'share_token' => $shareToken,
                        'sequence_id' => $sequenceId
                    ]);
                }
            } catch (Exception $e) {
                error_log("Error en nurturing sequence DIGITAL-H: " . $e->getMessage());
                // No fallar la respuesta del diagnóstico si el nurturing falla
            }
        }
    }
    
    // Fallback al email de agradecimiento legacy si no se envió el email unificado
    $emailSent = false;
    if (!$email1Sent) {
        try {
            $emailSent = sendThankYouEmail($email, $name, $company, $imd, $level, $insertId, $shareToken);
        } catch (Exception $emailError) {
            error_log("Error enviando email de agradecimiento DIGITAL-H: " . $emailError->getMessage());
            $emailSent = false;
        }
    } else {
        $emailSent = true;
    }
    
    sendJSON([
        'success' => true,
        'message' => 'Diagnostico guardado correctamente',
        'id' => $insertId,
        'share_token' => $shareToken,
        'sequence_id' => $sequenceId,
        'email_sent' => $emailSent,
        'email1_sent' => $email1Sent
    ]);
    
} catch (Exception $e) {
    error_log("Error en diagnostic.php: " . $e->getMessage());
    sendJSON(['error' => 'Error al guardar el diagnostico', 'debug' => $e->getMessage()], 500);
}

/**
 * Calcula la dimensión más débil a partir de las respuestas.
 * Mapeo de prefijos: E=strategy, C=culture, T=talent, I=tech, P=process, B=wellbeing
 */
function calculateWeakDimension($answers) {
    if (!is_array($answers) || empty($answers)) {
        return null;
    }

    $dimensionMap = [
        'E' => 'strategy',
        'C' => 'culture',
        'T' => 'talent',
        'I' => 'tech',
        'P' => 'process',
        'B' => 'wellbeing'
    ];

    $scores = [];
    foreach ($answers as $questionId => $value) {
        $prefix = strtoupper(substr($questionId, 0, 1));
        if (!isset($dimensionMap[$prefix])) {
            continue;
        }
        $dimension = $dimensionMap[$prefix];
        if (!isset($scores[$dimension])) {
            $scores[$dimension] = [];
        }
        $scores[$dimension][] = (float)$value;
    }

    if (empty($scores)) {
        return null;
    }

    $averages = [];
    foreach ($scores as $dimension => $values) {
        $averages[$dimension] = array_sum($values) / count($values);
    }

    $minAverage = min($averages);
    $weakest = array_filter($averages, function ($avg) use ($minAverage) {
        return abs($avg - $minAverage) < 0.001;
    });

    return array_key_first($weakest);
}

/**
 * Inserta o actualiza el lead en nurturing_sequences (sistema unificado).
 */
function insertEmailSequence($pdo, $data) {
    $weakDimension = calculateWeakDimension($data['answers'] ?? []);
    $gdprConsent = !empty($data['gdpr_consent']) ? 1 : 0;
    $marketingConsent = isset($data['marketing_consent']) ? ($data['marketing_consent'] ? 1 : 0) : 1;

    $stmt = $pdo->prepare("
        INSERT INTO nurturing_sequences 
        (email, name, company, product, score, maturity_level, weak_dimension, 
         status, current_step, total_steps, gdpr_consent, marketing_consent, gdpr_timestamp, next_send_at)
        VALUES (?, ?, ?, 'digital-h', ?, ?, ?, 'active', 0, 5, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            company = VALUES(company),
            score = VALUES(score),
            maturity_level = VALUES(maturity_level),
            weak_dimension = VALUES(weak_dimension),
            current_step = 0,
            status = 'active',
            gdpr_consent = VALUES(gdpr_consent),
            marketing_consent = VALUES(marketing_consent),
            gdpr_timestamp = NOW(),
            next_send_at = NOW(),
            last_sent_at = NULL,
            emails_opened = 0,
            emails_clicked = 0,
            total_emails_sent = 0,
            retry_count = 0,
            last_error = NULL,
            updated_at = NOW()
    ");

    $stmt->execute([
        $data['email'],
        $data['name'],
        $data['company'],
        $data['score'],
        $data['level'],
        $weakDimension,
        $gdprConsent,
        $marketingConsent,
    ]);

    $select = $pdo->prepare("SELECT id FROM nurturing_sequences WHERE email = ? AND product = 'digital-h'");
    $select->execute([$data['email']]);
    $row = $select->fetch(PDO::FETCH_ASSOC);

    return $row ? (int)$row['id'] : null;
}

/**
 * Envía Email 1 inmediatamente con los resultados del diagnóstico.
 */
function sendEmail1($data) {
    global $SMTP_FROM;

    $name = htmlspecialchars($data['name'] ?? 'Líder');
    $company = htmlspecialchars($data['company'] ?? 'tu empresa');
    $score = htmlspecialchars($data['score'] ?? '');
    $level = htmlspecialchars($data['level'] ?? '');
    $email = htmlspecialchars($data['email'] ?? '');
    $sequenceId = $data['sequence_id'] ?? null;
    $id = $data['id'] ?? null;
    $shareToken = $data['share_token'] ?? null;

    $resultsUrl = '';
    if ($id && $shareToken) {
        $resultsUrl = 'https://acrux.life/digital-h/#results/' . urlencode((string)$id) . '/' . urlencode((string)$shareToken);
    } else {
        $resultsUrl = 'https://acrux.life/digital-h/resultados?email=' . urlencode($email);
    }

    $trackingPixel = '';
    if ($sequenceId) {
        $trackingPixel = "<img src='https://acrux.life/api/track-open.php?sid=" . base64_encode((string)$sequenceId) . "' width='1' height='1' />";
    }

    $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background-color: #1B2A4A; padding: 30px; text-align: center;">
            <img src="https://acrux.life/acrux_logo.svg" alt="ACRUX" style="height: 40px;">
        </div>
        <div style="padding: 40px 30px;">
            <h1 style="color: #1B2A4A; font-size: 24px; margin-bottom: 20px;">Hola ' . $name . ',</h1>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Gracias por completar el diagnóstico <strong>DIGITAL-H</strong>. 
                Hemos analizado la madurez digital de <strong>' . $company . '</strong>.
            </p>
            
            <div style="background-color: #f8f9fa; border-left: 4px solid #7C9885; padding: 20px; margin: 25px 0;">
                <h3 style="color: #1B2A4A; margin-top: 0;">Tu nivel de madurez digital:</h3>
                <p style="font-size: 28px; font-weight: bold; color: #1B2A4A; margin: 10px 0;">' . $level . '</p>
                <p style="color: #666; margin: 0;">Puntuación: ' . $score . '/100</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="' . $resultsUrl . '" 
                   style="display: inline-block; background-color: #7C9885; color: #ffffff; 
                          padding: 15px 30px; text-decoration: none; border-radius: 5px; 
                          font-weight: bold; font-size: 16px;">
                    Ver reporte completo
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5; text-align: center;">
                ¿Quieres profundizar? <strong>Agenda una llamada gratuita de 30 minutos</strong>.
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
                <a href="https://calendly.com/acrux-consultores?utm_source=email&utm_medium=digital-h&utm_campaign=email1" 
                   style="display: inline-block; background-color: transparent; color: #1B2A4A; 
                          padding: 12px 25px; text-decoration: none; border: 2px solid #1B2A4A; 
                          border-radius: 5px; font-weight: bold;">
                    Agendar llamada
                </a>
            </div>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
                ACRUX Consultores | Colombia<br>
                <a href="https://acrux.life?utm_source=email&utm_medium=digital-h&utm_campaign=email1" style="color: #1B2A4A;">acrux.life</a>
            </p>
        </div>
    </div>
    ' . $trackingPixel . '
</body>
</html>';

    $subject = 'Tus resultados de DIGITAL-H están listos';
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . ($SMTP_FROM ?: 'ACRUX Consultores <hola@acrux.life>') . "\r\n";
    $headers .= "Reply-To: hola@acrux.life\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    return mail($email, $subject, $html, $headers, '-f hola@acrux.life');
}

?>
