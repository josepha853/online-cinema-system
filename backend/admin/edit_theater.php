<?php
include('../config/connection.php');
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin') {
    header("Location: ../models/login.php");
    exit();
}

$id = intval($_GET['id']);

// Fetch theater info
$stmt = $conn->prepare("SELECT * FROM theaters WHERE theater_id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$theater = $stmt->get_result()->fetch_assoc();
$stmt->close();

// Update theater
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = htmlspecialchars($_POST['name']);
    $address = htmlspecialchars($_POST['address']);
    $contact = htmlspecialchars($_POST['contact']);
    $city = htmlspecialchars($_POST['city']);

    $stmt2 = $conn->prepare("UPDATE theaters SET name=?, address=?, contact=?, city=? WHERE theater_id=?");
    $stmt2->bind_param("ssssi", $name, $address, $contact, $city, $id);
    $stmt2->execute();
    $stmt2->close();
    header("Location: theaters.php");
}

