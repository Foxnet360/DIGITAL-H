<?php
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $conn = getDBConnection();
    $result = $conn->query("SELECT 1");
    $conn->close();
    
    echo json_encode([
        'status' => 'ok',
        'database' => 'connected',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'database' => 'disconnected',
        'error' => $e->getMessage()
    ]);
}
?>
