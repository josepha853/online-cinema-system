<?php
// Test theater API endpoint directly
header('Content-Type: application/json');

try {
    require_once 'config/connection.php';
    require_once 'models/Theater.php';
    
    $theater = new Theater();
    $theaters = $theater->getAllTheaters();
    
    echo json_encode([
        'success' => true,
        'count' => count($theaters),
        'data' => $theaters
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ], JSON_PRETTY_PRINT);
}
?>
