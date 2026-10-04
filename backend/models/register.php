<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include DB connection
include("../config/connection.php");

// Read input
$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$phone = trim($data['phone'] ?? '');

if ($name && $email && $password) {
    $name = mysqli_real_escape_string($conn, $name);
    $email = mysqli_real_escape_string($conn, $email);
    $phone = mysqli_real_escape_string($conn, $phone);
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Check if email exists
    $check = mysqli_query($conn, "SELECT user_id FROM users WHERE email='$email'");
    if (mysqli_num_rows($check) > 0) {
        echo json_encode(["status"=>"error","message"=>"Email already exists!"]);
        exit;
    }

    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (name,email,password,phone,role,wallet_balance,loyalty_points,created_at) VALUES (?, ?, ?, ?, 'customer',0.00,0,NOW())");
    $stmt->bind_param("ssss",$name,$email,$passwordHash,$phone);

    if ($stmt->execute()) {
        // ✅ Send success message
        echo json_encode(["status"=>"success","message"=>"🎉 Registration successful! Welcome $name"]);
    } else {
        echo json_encode(["status"=>"error","message"=>"Database insert failed: ".$stmt->error]);
    }
} else {
    echo json_encode(["status"=>"error","message"=>"Please fill all required fields!"]);
}
?>
