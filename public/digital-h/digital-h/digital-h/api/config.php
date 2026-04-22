<?php
// Configuración de la base de datos MySQL
// Hostinger usa localhost por defecto
$DB_HOST = getenv('DB_HOST') ?: 'localhost';
$DB_USER = getenv('DB_USER') ?: 'u554044004_acruxuser';
$DB_PASS = getenv('DB_PASSWORD') ?: '4Crux2026*';
$DB_NAME = getenv('DB_NAME') ?: 'u554044004_acruxdb';

// Configuración SMTP
$SMTP_HOST = getenv('SMTP_HOST') ?: 'smtp.hostinger.com';
$SMTP_PORT = getenv('SMTP_PORT') ?: 465;
$SMTP_SECURE = getenv('SMTP_SECURE') === 'true';
$SMTP_USER = getenv('SMTP_USER') ?: 'hola@acrux.life';
$SMTP_PASS = getenv('SMTP_PASS') ?: '4Crux2026*';
$SMTP_FROM = getenv('SMTP_FROM') ?: 'DIGITAL-H <hola@acrux.life>';

// Función para conectar a la BD
function getDBConnection() {
    global $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME;
    
    $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
    
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8mb4");
    return $conn;
}

// Función para enviar respuesta JSON
function sendJSON($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

// Función para enviar email
function sendThankYouEmail($email, $name, $company, $imd, $level) {
    global $SMTP_HOST, $SMTP_PORT, $SMTP_SECURE, $SMTP_USER, $SMTP_PASS, $SMTP_FROM;
    
    $userLevels = [
        'Inicial' => 'Explorador Digital',
        'Emergente' => 'Pionero Digital',
        'Desarrollo' => 'Innovador Digital',
        'Avanzado' => 'Transformador Digital',
        'Excelente' => 'Líder Digital',
        'Referente' => 'Visionario Digital'
    ];
    
    $userLevel = $userLevels[$level] ?? 'Explorador Digital';
    
    $levelDescriptions = [
        'Inicial' => 'Tu organización está en una etapa inicial de transformación digital. Es el momento perfecto para comenzar a construir una estrategia sólida.',
        'Emergente' => 'Has dado los primeros pasos hacia la transformación digital. Hay oportunidades claras para estructurar y acelerar tu maduración.',
        'Desarrollo' => 'Tu transformación digital está en curso. Continúa fortaleciendo los fundamentos para lograr un impacto mayor.',
        'Avanzado' => 'Tienes una buena madurez digital. Es momento de optimizar procesos y escalar las iniciativas exitosas.',
        'Excelente' => '¡Excelente nivel de madurez! Tu organización está liderando la transformación digital. Mantén la innovación continua.',
        'Referente' => 'Eres un referente en madurez digital. Tu organización es un modelo a seguir en transformación e innovación.'
    ];
    
    $description = $levelDescriptions[$level] ?? $levelDescriptions['Inicial'];
    
    $subject = "Gracias por tu diagnóstico DIGITAL-H, $name";
    
    $html = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset=\"utf-8\">
        <title>Gracias por tu diagnóstico DIGITAL-H</title>
    </head>
    <body style=\"font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;\">
        <div style=\"background: linear-gradient(135deg, #1e3a5f 0%, #2e86ab 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;\">
            <img src=\"https://acrux.life/acrux_logo.svg\" alt=\"Acrux Consultores\" style=\"height: 48px; margin-bottom: 16px;\" />
            <h1 style=\"color: white; margin: 0; font-size: 28px;\">DIGITAL-H</h1>
            <p style=\"color: #00d4ff; margin: 10px 0 0 0; font-size: 16px;\">Diagnóstico de Madurez Digital</p>
        </div>
        
        <div style=\"background: #ffffff; padding: 40px 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px;\">
            <h2 style=\"color: #1e3a5f; margin-top: 0;\">¡Hola $name! 👋</h2>
            
            <p>Gracias por completar el diagnóstico de madurez digital de <strong>$company</strong>.</p>
            
            <div style=\"background: #f0f4f8; padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center;\">
                <p style=\"margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;\">Tu Índice de Madurez Digital</p>
                <div style=\"font-size: 48px; font-weight: 800; color: #1e3a5f; margin: 8px 0;\">$imd%</div>
                <div style=\"display: inline-block; background: #00d4ff; color: #1e3a5f; padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 14px;\">
                    $level — $userLevel
                </div>
            </div>
            
            <p>$description</p>
            
            <hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;\">
            
            <h3 style=\"color: #1e3a5f;\">¿Quiénes somos?</h3>
            <p><strong>Acrux Consultores</strong> somos expertos en transformación digital y desarrollo organizacional. Ayudamos a empresas como la tuya a alcanzar su máximo potencial a través de soluciones innovadoras y estrategias personalizadas.</p>
            
            <div style=\"margin: 24px 0;\">
                <a href=\"https://acrux.life\" style=\"display: inline-block; background: #1e3a5f; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700;\">Conoce más sobre nosotros →</a>
            </div>
            
            <p style=\"font-size: 14px; color: #64748b;\">
                📍 Armenia, Quindío, Colombia<br>
                🌐 <a href=\"https://acrux.life\" style=\"color: #1e3a5f;\">www.acrux.life</a><br>
                📧 contacto@acrux.life
            </p>
            
            <hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;\">
            
            <p style=\"font-size: 13px; color: #94a3b8; margin: 0;\">
                Este diagnóstico fue generado por <strong>DIGITAL-H</strong>, una herramienta de <a href=\"https://acrux.life\" style=\"color: #1e3a5f;\">Acrux Consultores</a>.
            </p>
        </div>
    </body>
    </html>
    ";
    
    // Usar mail() de PHP (Hostinger soporta esto con SMTP configurado)
    // O usar PHPMailer si está disponible
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: $SMTP_FROM\r\n";
    $headers .= "Reply-To: hola@acrux.life\r\n";
    
    // En Hostinger Business, mail() usa el SMTP configurado en el panel
    return mail($email, $subject, $html, $headers);
}

// Función para calcular dimensiones
function calculateDimensions($answers) {
    $dimensionMap = [
        'strategy' => [],
        'culture' => [],
        'talent' => [],
        'tech' => [],
        'process' => [],
        'wellbeing' => []
    ];
    
    foreach ($answers as $id => $value) {
        $prefix = substr($id, 0, 1);
        switch ($prefix) {
            case 'E': $dimensionMap['strategy'][] = $value; break;
            case 'C': $dimensionMap['culture'][] = $value; break;
            case 'T': $dimensionMap['talent'][] = $value; break;
            case 'I': $dimensionMap['tech'][] = $value; break;
            case 'P': $dimensionMap['process'][] = $value; break;
            case 'B': $dimensionMap['wellbeing'][] = $value; break;
        }
    }
    
    $result = [];
    foreach ($dimensionMap as $key => $values) {
        if (count($values) > 0) {
            $result[$key] = round(array_sum($values) / count($values), 2);
        } else {
            $result[$key] = 0;
        }
    }
    
    return $result;
}
?>
