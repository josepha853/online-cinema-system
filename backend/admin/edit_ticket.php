
<?php
include('../config/connection.php');
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin') {
    header("Location: ../models/login.php");
    exit();
}

// Get ticket ID from URL
if (!isset($_GET['id'])) {
    header("Location: ticket_types.php");
    exit();
}

$type_id = intval($_GET['id']);

// Fetch ticket info
$stmt = $conn->prepare("
    SELECT tt.*, m.title AS show_title
    FROM ticket_types tt
    JOIN showtimes s ON tt.show_id = s.show_id
    JOIN movies m ON s.movie_id = m.movie_id
    WHERE tt.type_id = ?
");
$stmt->bind_param("i", $type_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo "Ticket Type not found!";
    exit();
}

$ticket = $result->fetch_assoc();
$stmt->close();

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars($_POST['name']);
    $price = floatval($_POST['price']);
    $quantity_total = intval($_POST['quantity_total']);

    // Ensure remaining quantity is at least 0
    $quantity_remaining = max(0, $quantity_total - ($ticket['quantity_total'] - $ticket['quantity_remaining']));

    $stmt = $conn->prepare("UPDATE ticket_types SET name=?, price=?, quantity_total=?, quantity_remaining=? WHERE type_id=?");
    $stmt->bind_param("siddi", $name, $price, $quantity_total, $quantity_remaining, $type_id);

    if ($stmt->execute()) {
        echo "✅ Ticket Type updated successfully!";
        header("Refresh:1; url=ticket_types.php");
    } else {
        echo "❌ Error: " . $stmt->error;
    }

    $stmt->close();
}
?>


