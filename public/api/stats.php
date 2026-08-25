<?php
/**
 * Stats API for DIGITAL-H
 * Returns diagnostic counts for urgency indicators
 * 
 * GET /api/stats.php?type=weekly_count
 */

require_once 'config.php';

header('Content-Type: application/json');

// Validar CORS contra allow-list
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!isAllowedOrigin($origin)) {
    sendJSON(['error' => 'Origin not allowed'], 403);
}
if ($origin) {
    header("Access-Control-Allow-Origin: $origin");
}

// Only accept GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$type = $_GET['type'] ?? '';

try {
    $conn = getDBConnection();
    
    switch ($type) {
        case 'weekly_count':
            // Count diagnostics from last 7 days
            $stmt = $conn->prepare("
                SELECT COUNT(*) as count 
                FROM digitalh_results 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            ");
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            
            echo json_encode([
                'success' => true,
                'count' => (int)$row['count']
            ]);
            break;
            
        case 'total_count':
            // Count total diagnostics
            $stmt = $conn->prepare("SELECT COUNT(*) as count FROM digitalh_results");
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            
            echo json_encode([
                'success' => true,
                'count' => (int)$row['count']
            ]);
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'error' => 'Invalid type parameter'
            ]);
    }
    
    $conn->close();
    
} catch (Throwable $e) {
    error_log("Error in stats.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error'
    ]);
}
?>