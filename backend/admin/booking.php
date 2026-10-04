<?php
session_start();
include('../config/connection.php'); // from admin/ folder, config iri folder imwe inyuma

// Protect page
if (!isset($_SESSION['user_id'])) {
    // user atari logged in, ajyanwe kuri login page
    header("Location: ../models/login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Get available shows
$shows = $conn->query("
    SELECT s.show_id, m.title, t.name AS theater_name, s.show_date, s.show_time, s.available_seats
    FROM showtimes s
    JOIN movies m ON s.movie_id = m.movie_id
    JOIN theaters t ON s.theater_id = t.theater_id
    WHERE s.show_date >= CURDATE()
    ORDER BY s.show_date ASC, s.show_time ASC
");

// Handle booking form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['book_ticket'])) {
    $show_id = $_POST['show_id'];
    $ticket_type_id = $_POST['ticket_type_id'];
    $num_seats = $_POST['num_seats'];
    $payment_method = $_POST['payment_method'];

    // Get ticket price
    $ticket = $conn->query("SELECT price, quantity_remaining FROM ticket_types WHERE type_id = $ticket_type_id")->fetch_assoc();
    if (!$ticket || $ticket['quantity_remaining'] < $num_seats) {
        echo "<p style='color:red;'>❌ Not enough tickets available!</p>";
    } else {
        $total = $ticket['price'] * $num_seats;

        // Insert order
        $stmt = $conn->prepare("INSERT INTO orders (user_id, show_id, total_amount, payment_method, status) VALUES (?, ?, ?, ?, 'paid')");
        $stmt->bind_param("iids", $user_id, $show_id, $total, $payment_method);
        $stmt->execute();
        $order_id = $stmt->insert_id;
        $stmt->close();

        // Insert order_items
        for ($i = 1; $i <= $num_seats; $i++) {
            $seat_number = "S" . rand(1, 100); // simple seat assignment
            $stmt2 = $conn->prepare("INSERT INTO order_items (order_id, ticket_type_id, seat_number, price) VALUES (?, ?, ?, ?)");
            $stmt2->bind_param("iisd", $order_id, $ticket_type_id, $seat_number, $ticket['price']);
            $stmt2->execute();
            $stmt2->close();
        }

        // Update remaining tickets
        $conn->query("UPDATE ticket_types SET quantity_remaining = quantity_remaining - $num_seats WHERE type_id = $ticket_type_id");

        echo "<p style='color:green;'>✅ Booking successful! Total: $total RWF</p>";
    }
}
?>
