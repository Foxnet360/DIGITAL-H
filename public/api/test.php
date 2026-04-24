<?php
// Script de prueba para diagnosticar problemas
header('Content-Type: application/json; charset=utf-8');

$response = [];

// 1. Verificar que config.php existe
if (!file_exists('config.php')) {
    echo json_encode(['error' => 'config.php no encontrado']);
    exit;
}

// 2. Incluir config
require_once 'config.php';
$response['config_loaded'] = true;

// 3. Probar conexión a BD
try {
    $conn = getDBConnection();
    $response['db_connection'] = 'success';
    
    // 4. Verificar que la tabla existe
    $result = $conn->query("SHOW TABLES LIKE 'digitalh_results'");
    if ($result->num_rows > 0) {
        $response['table_exists'] = true;
    } else {
        $response['table_exists'] = false;
    }
    
    $conn->close();
} catch (Exception $e) {
    $response['db_connection'] = 'failed';
    $response['db_error'] = $e->getMessage();
}

// 5. Mostrar información de PHP
$response['php_version'] = PHP_VERSION;
$response['memory_limit'] = ini_get('memory_limit');

// 6. Verificar datos recibidos
$json = file_get_contents('php://input');
$data = json_decode($json, true);
$response['received_data'] = $data ? 'valid' : 'invalid';
if ($data) {
    $response['email'] = $data['email'] ?? 'missing';
}

echo json_encode($response);
?>
