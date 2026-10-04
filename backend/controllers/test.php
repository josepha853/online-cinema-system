<?php
// Simple test file to check if backend is working
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'message' => 'Backend is working!',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => phpversion()
]);
?>
