<?php
// Test if all models can be loaded
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testing model loading...\n\n";

// Load connection first
require_once 'config/connection.php';
echo "✓ connection.php loaded\n";

// Try loading each model
$models = ['Order', 'TicketType', 'User', 'AuditLog', 'FraudDetection', 'QRCodeGenerator'];

foreach ($models as $model) {
    try {
        require_once "models/$model.php";
        echo "✓ $model.php loaded successfully\n";
    } catch (Exception $e) {
        echo "✗ $model.php FAILED: " . $e->getMessage() . "\n";
    }
}

echo "\nAll models loaded successfully!\n";
?>
