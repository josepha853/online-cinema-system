<?php
session_start();
include('../config/connection.php');

// Gusuzuma niba ari admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    die("Access denied. Only admin can view this page.");
}

// Kubika show nshya
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_show'])) {
    $movie_id = $_POST['movie_id'];
    $theater_id = $_POST['theater_id'];
    $show_date = $_POST['show_date'];
    $show_time = $_POST['show_time'];
    $ticket_price = $_POST['ticket_price'];
    $available_seats = $_POST['available_seats'];

    $stmt = $conn->prepare("INSERT INTO showtimes (movie_id, theater_id, show_date, show_time, ticket_price, available_seats)
                            VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iissdi", $movie_id, $theater_id, $show_date, $show_time, $ticket_price, $available_seats);

    if ($stmt->execute()) {
        echo "<p style='color:green;'>✅ Show added successfully!</p>";
    } else {
        echo "<p style='color:red;'>❌ Error: " . $stmt->error . "</p>";
    }
}

// Gufata films na theaters byose
$movies = $conn->query("SELECT movie_id, title FROM movies");
$theaters = $conn->query("SELECT theater_id, name FROM theaters");

// Kwerekana shows zose
$shows = $conn->query("
    SELECT s.show_id, m.title, t.name AS theater_name, s.show_date, s.show_time, s.ticket_price, s.available_seats
    FROM showtimes s
    JOIN movies m ON s.movie_id = m.movie_id
    JOIN theaters t ON s.theater_id = t.theater_id
    ORDER BY s.show_date DESC, s.show_time ASC
");
?>

