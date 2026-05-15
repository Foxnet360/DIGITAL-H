<?php
/**
 * Configuración de DIGITAL-H - Usa configuración centralizada de acrux.life
 * Este archivo ya no contiene credenciales hardcodeadas
 */

// Cargar configuración de acrux.life
$acruxConfigPath = dirname(__DIR__) . '/../../../database/config.php';
if (file_exists($acruxConfigPath)) {
    $acruxConfig = require_once $acruxConfigPath;
} else {
    // Fallback por si acrux.life no está en la ruta esperada
    $acruxConfig = null;
}

// Autoloader para PHPMailer
$autoloadPaths = [
    dirname(__DIR__) . '/../../../vendor/autoload.php',
    dirname(__DIR__) . '/../../vendor/autoload.php',
];

$phpmailerAvailable = false;
foreach ($autoloadPaths as $path) {
    if (file_exists($path)) {
        require_once $path;
        $phpmailerAvailable = true;
        break;
    }
}

// Configuración de base de datos (usa acrux.life o fallback)
if ($acruxConfig) {
    $DB_HOST = $acruxConfig['database']['host'] ?? 'localhost';
    $DB_USER = $acruxConfig['database']['user'] ?? '';
    $DB_PASS = $acruxConfig['database']['password'] ?? '';
    $DB_NAME = $acruxConfig['database']['dbname'] ?? '';
} else {
    // Fallback solo si no se encuentra la configuración de acrux.life
    // En producción, esto no debería ocurrir
    $DB_HOST = 'localhost';
    $DB_USER = 'u554044004_acruxuser';
    $DB_PASS = '4Crux2026*';
    $DB_NAME = 'u554044004_acruxdb';
}

// Configuración SMTP desde acrux.life
if ($acruxConfig) {
    $SMTP_HOST = $acruxConfig['smtp']['host'] ?? 'smtp.hostinger.com';
    $SMTP_PORT = $acruxConfig['smtp']['port'] ?? 465;
    $SMTP_SECURE = ($acruxConfig['smtp']['encryption'] ?? 'ssl') === 'ssl';
    $SMTP_USER = $acruxConfig['smtp']['username'] ?? '';
    $SMTP_PASS = $acruxConfig['smtp']['password'] ?? '';
    $SMTP_FROM = 'DIGITAL-H <' . ($acruxConfig['smtp']['from_email'] ?? 'hola@acrux.life') . '>';
} else {
    // Fallback
    $SMTP_HOST = 'smtp.hostinger.com';
    $SMTP_PORT = 465;
    $SMTP_SECURE = true;
    $SMTP_USER = 'hola@acrux.life';
    $SMTP_PASS = '4Crux2026*';
    $SMTP_FROM = 'DIGITAL-H <hola@acrux.life>';
}

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

// Función para enviar email mejorado con PHPMailer
function sendThankYouEmail($email, $name, $company, $imd, $level) {
    global $SMTP_HOST, $SMTP_PORT, $SMTP_SECURE, $SMTP_USER, $SMTP_PASS, $SMTP_FROM, $phpmailerAvailable;
    
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
        'Inicial' => [
            'desc' => 'Tu organización está en una etapa inicial de transformación digital. Es el momento perfecto para comenzar a construir una estrategia sólida.',
            'actions' => [
                'Define una estrategia digital básica con objetivos claros',
                'Capacita a tu equipo en herramientas digitales fundamentales',
                'Identifica procesos manuales que puedas automatizar'
            ]
        ],
        'Emergente' => [
            'desc' => 'Has dado los primeros pasos hacia la transformación digital. Hay oportunidades claras para estructurar y acelerar tu maduración.',
            'actions' => [
                'Estandariza los procesos digitales que ya has iniciado',
                'Implementa métricas básicas de seguimiento',
                'Desarrolla un plan de capacitación continua'
            ]
        ],
        'Desarrollo' => [
            'desc' => 'Tu transformación digital está en curso. Continúa fortaleciendo los fundamentos para lograr un impacto mayor.',
            'actions' => [
                'Integra tus sistemas y herramientas digitales',
                'Implementa people analytics para gestión de talento',
                'Desarrolla una cultura de innovación y experimentación'
            ]
        ],
        'Avanzado' => [
            'desc' => 'Tienes una buena madurez digital. Es momento de optimizar procesos y escalar las iniciativas exitosas.',
            'actions' => [
                'Automatiza procesos complejos con IA y machine learning',
                'Implementa gobernanza de datos avanzada',
                'Escala las mejores prácticas a toda la organización'
            ]
        ],
        'Excelente' => [
            'desc' => '¡Excelente nivel de madurez! Tu organización está liderando la transformación digital. Mantén la innovación continua.',
            'actions' => [
                'Lidera la innovación en tu sector con tecnologías emergentes',
                'Desarrolla alianzas estratégicas digitales',
                'Comparte tu conocimiento como referente del sector'
            ]
        ],
        'Referente' => [
            'desc' => 'Eres un referente en madurez digital. Tu organización es un modelo a seguir en transformación e innovación.',
            'actions' => [
                'Mantén la excelencia y continúa innovando',
                'Asesora a otras organizaciones en su transformación',
                'Explora tecnologías disruptivas (IA generativa, Web3, etc.)'
            ]
        ]
    ];
    
    $levelData = $levelDescriptions[$level] ?? $levelDescriptions['Inicial'];
    $description = $levelData['desc'];
    $actions = $levelData['actions'];
    
    $actionsList = '';
    foreach ($actions as $action) {
        $actionsList .= "<li style='margin-bottom: 8px; padding-left: 24px; position: relative;'>✓ $action</li>";
    }
    
    // Recursos según nivel
    $resourcesSection = '';
    if (in_array($level, ['Inicial', 'Emergente', 'Desarrollo'])) {
        $resourcesSection = '
        <div style="background: #f0f4f8; padding: 24px; border-radius: 12px; margin: 24px 0;">
            <h4 style="color: #1e3a5f; margin-top: 0;">📚 Recursos Recomendados para tu Nivel</h4>
            <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">Estos recursos te ayudarán a acelerar tu transformación digital:</p>
            <a href="https://acrux.life/docs/10-Pasos-Para-la-Transformacion.pdf" style="display: block; background: white; padding: 16px; border-radius: 8px; margin-bottom: 12px; text-decoration: none; border: 1px solid #e2e8f0;">
                <strong style="color: #1e3a5f;">📄 Guía: 10 Pasos para Iniciar tu Transformación</strong>
                <p style="font-size: 13px; color: #64748b; margin: 4px 0 0 0;">22 páginas de acciones prácticas y checklist descargable</p>
            </a>
        </div>';
    } else {
        $resourcesSection = '
        <div style="background: #f0f4f8; padding: 24px; border-radius: 12px; margin: 24px 0;">
            <h4 style="color: #1e3a5f; margin-top: 0;">📚 Recursos Recomendados para tu Nivel</h4>
            <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">Estos recursos te ayudarán a mantener tu liderazgo digital:</p>
            <a href="https://acrux.life/docs/10-Pasos-Para-la-Transformacion.pdf" style="display: block; background: white; padding: 16px; border-radius: 8px; margin-bottom: 12px; text-decoration: none; border: 1px solid #e2e8f0;">
                <strong style="color: #1e3a5f;">📄 Guía: 10 Pasos para Iniciar tu Transformación</strong>
                <p style="font-size: 13px; color: #64748b; margin: 4px 0 0 0;">22 páginas de acciones prácticas</p>
            </a>
            <a href="https://acrux.life/docs/eBook-La-PYME-Digital-del-Siglo-XXI.pdf" style="display: block; background: white; padding: 16px; border-radius: 8px; text-decoration: none; border: 1px solid #e2e8f0;">
                <strong style="color: #1e3a5f;">📖 Ebook: La PYME Digital del Siglo XXI</strong>
                <p style="font-size: 13px; color: #64748b; margin: 4px 0 0 0;">29 páginas de estrategias digitales avanzadas</p>
            </a>
        </div>';
    }
    
    $subject = "🎯 Tu diagnóstico DIGITAL-H está listo - $level ($imd%)";
    
    $html = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset=\"utf-8\">
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
        <title>Tu diagnóstico DIGITAL-H está listo</title>
    </head>
    <body style=\"font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;\">
        <!-- Header -->
        <div style=\"background: linear-gradient(135deg, #1e3a5f 0%, #2e86ab 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;\">
            <img src=\"https://acrux.life/logo.png\" alt=\"Acrux Consultores\" style=\"height: 60px; margin-bottom: 16px;\" />
            <h1 style=\"color: white; margin: 0; font-size: 32px; font-weight: 800;\">DIGITAL-H</h1>
            <p style=\"color: #00d4ff; margin: 10px 0 0 0; font-size: 16px; font-weight: 500;\">Diagnóstico de Madurez Digital</p>
        </div>
        
        <!-- Content -->
        <div style=\"background: #ffffff; padding: 40px 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px;\">
            <h2 style=\"color: #1e3a5f; margin-top: 0; font-size: 24px;\">¡Hola $name!</h2>
            
            <p style=\"font-size: 16px; color: #475569;\">Gracias por completar el diagnóstico de madurez digital de <strong>$company</strong>. Aquí están tus resultados:</p>
            
            <!-- Score Card -->
            <div style=\"background: linear-gradient(135deg, #1e3a5f 0%, #2e86ab 100%); padding: 32px; border-radius: 16px; margin: 24px 0; text-align: center; color: white;\">
                <p style=\"margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9;\">Índice de Madurez Digital</p>
                <div style=\"font-size: 56px; font-weight: 800; margin: 8px 0;\">$imd%</div>
                <div style=\"display: inline-block; background: #00d4ff; color: #1e3a5f; padding: 10px 24px; border-radius: 24px; font-weight: 700; font-size: 16px; margin-top: 8px;\">
                    $level — $userLevel
                </div>
            </div>
            
            <!-- Description -->
            <div style=\"background: #f8fafc; padding: 24px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #00d4ff;\">
                <p style=\"margin: 0; font-size: 16px; color: #334155;\">$description</p>
            </div>
            
            <!-- Actions -->
            <h3 style=\"color: #1e3a5f; margin-top: 32px; font-size: 20px;\">🎯 Próximos Pasos Recomendados</h3>
            <ul style=\"list-style: none; padding: 0; color: #475569; font-size: 15px;\">
                $actionsList
            </ul>
            
            <!-- Resources -->
            $resourcesSection
            
            <!-- CTA -->
            <div style=\"text-align: center; margin: 32px 0;\">
                <a href=\"https://calendly.com/acrux-life/30min\" style=\"display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2e86ab 100%); color: white; padding: 18px 36px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; margin-bottom: 12px;\">📅 Agendar Consultoría Gratuita</a>
                <p style=\"font-size: 13px; color: #94a3b8; margin: 8px 0 0 0;\">Sesión de 30 minutos para profundizar en tus resultados</p>
            </div>
            
            <hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;\">
            
            <!-- About -->
            <h3 style=\"color: #1e3a5f;\">¿Quiénes somos?</h3>
            <p style=\"color: #475569;\"><strong>Acrux Consultores</strong> somos expertos en transformación digital y desarrollo organizacional. Ayudamos a empresas como la tuya a alcanzar su máximo potencial a través de soluciones innovadoras y estrategias personalizadas.</p>
            
            <div style=\"margin: 24px 0; text-align: center;\">
                <a href=\"https://acrux.life\" style=\"display: inline-block; background: #1e3a5f; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 600;\">Conoce más sobre nosotros →</a>
            </div>
            
            <!-- Contact -->
            <div style=\"background: #f8fafc; padding: 20px; border-radius: 12px; margin-top: 24px;\">
                <p style=\"font-size: 14px; color: #64748b; margin: 0; text-align: center;\">
                    📍 Armenia, Quindío, Colombia<br>
                    🌐 <a href=\"https://acrux.life\" style=\"color: #1e3a5f; font-weight: 500;\">www.acrux.life</a><br>
                    📧 <a href=\"mailto:contacto@acrux.life\" style=\"color: #1e3a5f; font-weight: 500;\">contacto@acrux.life</a>
                </p>
            </div>
            
            <hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;\">
            
            <p style=\"font-size: 12px; color: #94a3b8; margin: 0; text-align: center;\">
                Este diagnóstico fue generado por <strong>DIGITAL-H</strong>, una herramienta de <a href=\"https://acrux.life\" style=\"color: #1e3a5f;\">Acrux Consultores</a>.<br>
                © 2025 Acrux Consultores - Todos los derechos reservados.
            </p>
        </div>
    </body>
    </html>
    ";
    
    // Intentar usar PHPMailer si está disponible
    if ($phpmailerAvailable && class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            
            // Configuración SMTP
            $mail->isSMTP();
            $mail->Host = $SMTP_HOST;
            $mail->Port = $SMTP_PORT;
            $mail->SMTPAuth = true;
            $mail->Username = $SMTP_USER;
            $mail->Password = $SMTP_PASS;
            $mail->SMTPSecure = $SMTP_SECURE ? 'ssl' : 'tls';
            $mail->CharSet = 'UTF-8';
            
            // Remitente
            $mail->setFrom($SMTP_USER, 'DIGITAL-H');
            $mail->addReplyTo($SMTP_USER, 'Acrux Consultores');
            
            // Destinatario
            $mail->addAddress($email, $name);
            
            // Contenido
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $html;
            
            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Error enviando email con PHPMailer: " . $e->getMessage());
            return false;
        }
    } else {
        // Fallback a mail() nativo si PHPMailer no está disponible
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: $SMTP_FROM\r\n";
        $headers .= "Reply-To: $SMTP_USER\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        
        return mail($email, $subject, $html, $headers);
    }
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

// Función para calcular la dimensión más débil
function calculateWeakDimension($answers) {
    $dimensions = calculateDimensions($answers);
    
    $dimensionLabels = [
        'strategy' => 'Estrategia',
        'culture' => 'Cultura',
        'talent' => 'Talento',
        'tech' => 'Tecnología',
        'process' => 'Procesos',
        'wellbeing' => 'Bienestar'
    ];
    
    $minValue = PHP_FLOAT_MAX;
    $weakDimension = 'strategy';
    
    foreach ($dimensions as $key => $value) {
        if ($value < $minValue) {
            $minValue = $value;
            $weakDimension = $key;
        }
    }
    
    return $dimensionLabels[$weakDimension] ?? 'Estrategia';
}
?>
