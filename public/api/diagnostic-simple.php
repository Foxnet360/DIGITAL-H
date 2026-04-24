<?php
// Script de prueba simplificado para diagnostic.php
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

// Obtener datos
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

try {
    $conn = getDBConnection();
    
    // Query simplificado sin dimensiones
    $stmt = $conn->prepare("
        INSERT INTO digitalh_results 
        (name, email, company, company_size, imd_score, maturity_level, answers_json, gdpr_consent) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $name = $data['name'];
    $email = $data['email'];
    $company = $data['company'];
    $size = $data['size'] ?? 'No especificado';
    $imd = (int)$data['imd'];
    $level = $data['level'];
    $answersJson = json_encode($data['answers']);
    $gdpr = $data['gdprConsent'] ? 1 : 0;
    
    $stmt->bind_param("ssssissi", $name, $email, $company, $size, $imd, $level, $answersJson, $gdpr);
    
    $stmt->execute();
    $id = $conn->insert_id;
    
    $stmt->close();
    $conn->close();
    
    echo json_encode([
        'success' => true,
        'id' => $id,
        'message' => 'Guardado correctamente'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
?>
