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

// Manejar GET - Verificar disponibilidad de slots
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $date = $_GET['date'] ?? null;
    
    if (!$date) {
        sendJSON(['error' => 'Fecha requerida'], 400);
    }
    
    try {
        $conn = getDBConnection();
        
        // Obtener slots ocupados para la fecha
        $stmt = $conn->prepare("SELECT booking_time FROM digitalh_bookings WHERE booking_date = ? AND status != 'cancelled'");
        $stmt->bind_param("s", $date);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $bookedSlots = [];
        while ($row = $result->fetch_assoc()) {
            $bookedSlots[] = $row['booking_time'];
        }
        
        $stmt->close();
        $conn->close();
        
        sendJSON([
            'success' => true,
            'date' => $date,
            'booked_slots' => $bookedSlots
        ]);
        
    } catch (Exception $e) {
        error_log("Error en booking.php GET: " . $e->getMessage());
        sendJSON(['error' => 'Error al verificar disponibilidad'], 500);
    }
}

// Manejar POST - Crear reserva
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!$data) {
        sendJSON(['error' => 'Datos JSON invalidos'], 400);
    }
    
    // Validar campos requeridos
    $required = ['email', 'name', 'company', 'booking_date', 'booking_time'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            sendJSON(['error' => "Campo requerido: $field"], 400);
        }
    }
    
    // Validar email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        sendJSON(['error' => 'Email invalido'], 400);
    }
    
    // Validar fecha (mínimo 24h de anticipación)
    $bookingDate = new DateTime($data['booking_date']);
    $tomorrow = new DateTime();
    $tomorrow->modify('+1 day');
    $tomorrow->setTime(0, 0, 0);
    
    if ($bookingDate < $tomorrow) {
        sendJSON(['error' => 'La reserva debe ser con al menos 24 horas de anticipación'], 400);
    }
    
    // Validar que no sea fin de semana
    $dayOfWeek = (int)$bookingDate->format('w');
    if ($dayOfWeek === 0 || $dayOfWeek === 6) {
        sendJSON(['error' => 'No se pueden hacer reservas en fines de semana'], 400);
    }
    
    // Validar horario laboral (9:00 - 17:00)
    $time = $data['booking_time'];
    $validTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    if (!in_array($time, $validTimes)) {
        sendJSON(['error' => 'Horario no válido'], 400);
    }
    
    $email = $data['email'];
    $name = $data['name'];
    $company = $data['company'];
    $bookingDateStr = $data['booking_date'];
    $bookingTimeStr = $data['booking_time'];
    
    try {
        $conn = getDBConnection();
        
        // Iniciar transacción para evitar doble-booking
        $conn->begin_transaction();
        
        try {
            // Verificar si el slot ya está ocupado (con bloqueo)
            $checkStmt = $conn->prepare("
                SELECT id FROM digitalh_bookings 
                WHERE booking_date = ? AND booking_time = ? AND status != 'cancelled'
                FOR UPDATE
            ");
            $checkStmt->bind_param("ss", $bookingDateStr, $bookingTimeStr);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();
            
            if ($checkResult->num_rows > 0) {
                $checkStmt->close();
                $conn->rollback();
                $conn->close();
                sendJSON(['error' => 'Este horario ya no está disponible. Por favor selecciona otro.'], 409);
            }
            
            $checkStmt->close();
            
            // Crear la reserva
            $stmt = $conn->prepare("
                INSERT INTO digitalh_bookings 
                (lead_email, lead_name, company, booking_date, booking_time, status) 
                VALUES (?, ?, ?, ?, ?, 'pending')
            ");
            
            $stmt->bind_param(
                "sssss",
                $email,
                $name,
                $company,
                $bookingDateStr,
                $bookingTimeStr
            );
            
            $stmt->execute();
            $insertId = $conn->insert_id;
            $stmt->close();
            
            // Confirmar transacción
            $conn->commit();
            
            // Enviar email de confirmación al usuario
            sendBookingConfirmationEmail($email, $name, $company, $bookingDateStr, $bookingTimeStr);
            
            // Enviar notificación al equipo Acrux
            sendBookingNotificationEmail($name, $company, $email, $bookingDateStr, $bookingTimeStr);
            
            $conn->close();
            
            sendJSON([
                'success' => true,
                'message' => 'Reserva creada correctamente',
                'id' => $insertId,
                'booking_date' => $bookingDateStr,
                'booking_time' => $bookingTimeStr
            ]);
            
        } catch (Exception $e) {
            $conn->rollback();
            throw $e;
        }
        
    } catch (Exception $e) {
        error_log("Error en booking.php POST: " . $e->getMessage());
        sendJSON(['error' => 'Error al crear la reserva'], 500);
    }
}

// Si no es GET ni POST
sendJSON(['error' => 'Método no permitido'], 405);

// Función para enviar email de confirmación al usuario
function sendBookingConfirmationEmail($email, $name, $company, $date, $time) {
    global $SMTP_FROM;
    
    $dateFormatted = date('d \d\e F \d\e Y', strtotime($date));
    $timeFormatted = $time;
    
    $subject = "=?UTF-8?B?" . base64_encode("✅ Tu sesión con Acrux está confirmada") . "?=";
    
    $html = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset=\"utf-8\">
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
        <title>Sesión Confirmada</title>
    </head>
    <body style=\"font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;\">
        
        <div style=\"background: linear-gradient(135deg, #1e3a5f 0%, #2e86ab 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;\">
            <h1 style=\"color: white; margin: 0; font-size: 28px; font-weight: 800;\">✅ Reserva Confirmada</h1>
        </div>
        
        <div style=\"background: #ffffff; padding: 40px 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px;\">
            <h2 style=\"color: #1e3a5f; margin-top: 0;\">¡Hola $name!</h2>
            <p style=\"font-size: 16px; color: #475569;\">Tu sesión de consultoría con <strong>Acrux Consultores</strong> ha sido confirmada:</p>
            
            <div style=\"background: #f0f4f8; padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center;\">
                <p style=\"margin: 0 0 8px 0; font-size: 14px; color: #64748b;\">📅 Fecha</p>
                <p style=\"margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #1e3a5f;\">$dateFormatted</p>
                <p style=\"margin: 0 0 8px 0; font-size: 14px; color: #64748b;\">🕐 Hora</p>
                <p style=\"margin: 0; font-size: 20px; font-weight: 700; color: #1e3a5f;\">$timeFormatted</p>
            </div>
            
            <p style=\"color: #475569;\">Nos comunicaremos contigo pronto para confirmar los detalles de la videollamada.</p>
            
            <hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;\">
            
            <p style=\"font-size: 12px; color: #94a3b8; margin: 0; text-align: center;\">
                © 2026 Acrux Consultores - Todos los derechos reservados.
            </p>
        </div>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: $SMTP_FROM\r\n";
    $headers .= "Reply-To: hola@acrux.life\r\n";
    
    $additional_params = "-f hola@acrux.life";
    
    return mail($email, $subject, $html, $headers, $additional_params);
}

// Función para enviar notificación al equipo Acrux
function sendBookingNotificationEmail($name, $company, $email, $date, $time) {
    global $SMTP_FROM;
    
    $dateFormatted = date('d \d\e F \d\e Y', strtotime($date));
    
    $subject = "=?UTF-8?B?" . base64_encode("🗓️ Nueva reserva: $name - $company") . "?=";
    
    $html = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset=\"utf-8\">
        <title>Nueva Reserva DIGITAL-H</title>
    </head>
    <body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;\">
        <h2 style=\"color: #1e3a5f;\">🗓️ Nueva Reserva de Sesión</h2>
        
        <table style=\"width: 100%; border-collapse: collapse; margin: 20px 0;\">
            <tr>
                <td style=\"padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;\">Nombre:</td>
                <td style=\"padding: 8px; border-bottom: 1px solid #e2e8f0;\">$name</td>
            </tr>
            <tr>
                <td style=\"padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;\">Email:</td>
                <td style=\"padding: 8px; border-bottom: 1px solid #e2e8f0;\">$email</td>
            </tr>
            <tr>
                <td style=\"padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;\">Empresa:</td>
                <td style=\"padding: 8px; border-bottom: 1px solid #e2e8f0;\">$company</td>
            </tr>
            <tr>
                <td style=\"padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;\">Fecha:</td>
                <td style=\"padding: 8px; border-bottom: 1px solid #e2e8f0;\">$dateFormatted</td>
            </tr>
            <tr>
                <td style=\"padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;\">Hora:</td>
                <td style=\"padding: 8px; border-bottom: 1px solid #e2e8f0;\">$time</td>
            </tr>
        </table>
        
        <p style=\"color: #64748b;\">Esta reserva fue generada automáticamente desde DIGITAL-H.</p>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: $SMTP_FROM\r\n";
    
    $additional_params = "-f hola@acrux.life";
    
    return mail('hola@acrux.life', $subject, $html, $headers, $additional_params);
}
?>
