<?php
include('../config/connection.php');
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin') {
    header("Location: ../models/login.php");
    exit();
}

$sql = "SELECT b.booking_id, u.name AS user_name, t.show_name, b.quantity, b.total_amount, b.status, b.booking_date 
        FROM bookings b
        JOIN users u ON b.user_id = u.user_id
        JOIN tickets t ON b.ticket_id = t.ticket_id
        ORDER BY b.booking_date DESC";
$result = $conn->query($sql);
?>


    <?php endwhile; ?>

