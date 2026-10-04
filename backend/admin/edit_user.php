<?php
include('../config/connection.php');
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin') {
    header("Location: ../models/login.php");
    exit();
}

if (!isset($_GET['id'])) { exit("User ID missing"); }
$id = intval($_GET['id']);

// Fetch user info
$stmt = $conn->prepare("SELECT name, email, phone, role FROM users WHERE user_id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

// Update form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = htmlspecialchars($_POST['name']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars($_POST['phone']);
    $role = $_POST['role'];

    $stmt2 = $conn->prepare("UPDATE users SET name=?, email=?, phone=?, role=? WHERE user_id=?");
    $stmt2->bind_param("ssssi", $name, $email, $phone, $role, $id);
    $stmt2->execute();
    $stmt2->close();
    header("Location: users.php");
}

