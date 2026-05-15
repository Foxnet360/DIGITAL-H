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
$required = ['email', 'name', 'company', 'booking_date', 'booking_time'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        sendJSON(['error' => "Falta el campo requerido: $field"], 400);
    }
}

$email = $data['email'];
$name = $data['name'];
$company = $data['company'];
$bookingDate = $data['booking_date'];
$bookingTime = $data['booking_time'];

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJSON(['error' => 'Email invalido'], 400);
}

// Validar que la fecha no sea en el pasado y tenga al menos 24h de anticipación
$bookingDateTime = new DateTime("$bookingDate $bookingTime");
$now = new DateTime();
$now->modify('+24 hours');

if ($bookingDateTime < $now) {
    sendJSON(['error' => 'La reserva debe ser con al menos 24 horas de anticipación'], 400);
}

// Validar que no sea fin de semana
$dayOfWeek = (int)$bookingDateTime->format('w');
if ($dayOfWeek === 0 || $dayOfWeek === 6) {
    sendJSON(['error' => 'No se pueden hacer reservas en fines de semana'], 400);
}

try {
    $conn = getDBConnection();
    
    // Verificar si el slot ya está ocupado (prevención de double-booking)
    $checkStmt = $conn->prepare("
        SELECT id FROM digitalh_bookings 
        WHERE booking_date = ? AND booking_time = ? AND status != 'cancelled'
    ");
    $checkStmt->bind_param("ss", $bookingDate, $bookingTime);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows > 0) {
        $checkStmt->close();
        $conn->close();
        sendJSON(['error' => 'Este horario ya fue reservado. Por favor selecciona otro.'], 409);
    }
    $checkStmt->close();
    
    // Insertar la reserva
    $stmt = $conn->prepare("
        INSERT INTO digitalh_bookings 
        (lead_email, lead_name, company, booking_date, booking_time, status, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, 'pending', NOW(), NOW())
    ");
    
    $stmt->bind_param("sssss", $email, $name, $company, $bookingDate, $bookingTime);
    $stmt->execute();
    
    $bookingId = $conn->insert_id;
    $stmt->close();
    
    // Enviar email de confirmación al usuario
    $userEmailSent = sendBookingConfirmationEmail($email, $name, $company, $bookingDate, $bookingTime);
    
    // Enviar notificación al equipo de Acrux
    $adminEmailSent = sendBookingNotificationEmail($email, $name, $company, $bookingDate, $bookingTime);
    
    $conn->close();
    
    sendJSON([
        'success' => true,
        'message' => 'Reserva creada correctamente',
        'booking_id' => $bookingId,
        'user_email_sent' => $userEmailSent,
        'admin_email_sent' => $adminEmailSent
    ]);
    
} catch (Exception $e) {
    error_log("Error en booking.php: " . $e->getMessage());
    sendJSON(['error' => 'Error al crear la reserva', 'debug' => $e->getMessage()], 500);
}

function sendBookingConfirmationEmail($email, $name, $company, $date, $time) {
    $subject = "Confirmación de tu sesión con Acrux Consultores";
    $formattedDate = date('d \d\e F \d\e Y', strtotime($date));
    
    $message = "
    <html>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
        <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
            <h2 style='color: #1e3a5f;'>¡Hola $name!</h2>
            <p>Tu sesión de 30 minutos con nuestro Psicólogo Organizacional ha sido programada.</p>
            <div style='background: #f0f4f8; padding: 20px; border-radius: 10px; margin: 20px 0;'>
                <p><strong>Fecha:</strong> $formattedDate</p>
                <p><strong>Hora:</strong> $time</p>
                <p><strong>Empresa:</strong> $company</p>
                <p><strong>Duración:</strong> 30 minutos</p>
            </div>
            <p>Te contactaremos pronto para confirmar los detalles de la conexión.</p>
            <p style='color: #666; font-size: 14px;'>Si necesitas cancelar o reprogramar, por favor responde a este email.</p>
        </div>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Acrux Consultores <contacto@acrux.life>\r\n";
    
    return mail($email, $subject, $message, $headers);
}

function sendBookingNotificationEmail($leadEmail, $leadName, $company, $date, $time) {
    $adminEmail = 'contacto@acrux.life'; // Change to actual admin email
    $subject = "Nueva reserva: $leadName - $company";
    
    $message = "
    Nueva reserva recibida:
    
    Cliente: $leadName
    Email: $leadEmail
    Empresa: $company
    Fecha: $date
    Hora: $time
    
    Por favor confirmar la disponibilidad y contactar al cliente.
    ";
    
    $headers = "From: Sistema de Reservas <no-reply@acrux.life>\r\n";
    
    return mail($adminEmail, $subject, $message, $headers);
}
?