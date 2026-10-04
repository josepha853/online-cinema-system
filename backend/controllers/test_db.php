<?php
require_once 'config/connection.php';

echo "1. Testing Database Connection...\n";
$db = new Database();
$conn = $db->getConnection();

if ($conn) {
    echo "SUCCESS: Connected to database.\n";
} else {
    echo "FAILURE: Could not connect to database.\n";
    exit(1);
}

echo "\n2. Checking 'users' table structure...\n";
$result = $conn->query("DESCRIBE users");
if ($result) {
    echo "SUCCESS: 'users' table exists. Columns:\n";
    while ($row = $result->fetch_assoc()) {
        echo " - " . $row['Field'] . " (" . $row['Type'] . ") " . ($row['Null'] === 'NO' ? 'NOT NULL' : 'NULL') . "\n";
    }
} else {
    echo "FAILURE: 'users' table not found or error: " . $conn->error . "\n";
    exit(1);
}

echo "\n3. Testing User Insertion...\n";
$test_email = "test_" . time() . "@example.com";
$password = password_hash("Test@123", PASSWORD_DEFAULT);
$sql = "INSERT INTO users (name, email, password, phone, role, wallet_balance, loyalty_points, created_at) VALUES (?, ?, ?, ?, ?, 0.00, 0, NOW())";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo "FAILURE: Prepare failed: " . $conn->error . "\n";
    exit(1);
}

$name = "Test User";
$phone = "1234567890";
$role = "customer";

$stmt->bind_param("sssss", $name, $test_email, $password, $phone, $role);

if ($stmt->execute()) {
    echo "SUCCESS: User inserted with ID: " . $stmt->insert_id . "\n";
    
    // Clean up
    $conn->query("DELETE FROM users WHERE user_id = " . $stmt->insert_id);
    echo "Cleaned up test user.\n";
} else {
    echo "FAILURE: Insert failed: " . $stmt->error . "\n";
}

$db->closeConnection();
?>
