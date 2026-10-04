<?php
require_once __DIR__ . '/../config/connection.php';
require_once __DIR__ . '/../models/Show.php';
require_once __DIR__ . '/../models/TicketType.php';
require_once __DIR__ . '/../models/Order.php';

header('Content-Type: application/javascript; charset=utf-8');

if (!is_logged_in()) {
    echo 'window.__BOOKING_DATA__ = null;';
    exit();
}

$show_id = isset($_GET['show_id']) ? (int)$_GET['show_id'] : 0;
$range = sanitize_input($_GET['range'] ?? 'daily');

// If show_id is invalid, fall back to first show
$database = new Database();
$conn = $database->getConnection();

$showModel = new Show();
$ticketTypeModel = new TicketType();
$orderModel = new Order();

$show = $showModel->getShowById($show_id);
if (!$show) {
    $show = $showModel->getFirstShow();
    $show_id = $show['show_id'] ?? 0;
}
$ticket_types = $ticketTypeModel->getByShow($show_id);
$user_id = $_SESSION['user_id'];
$recentBookings = $orderModel->getRecentOrdersByUser($user_id, 5);

$payload = [
    'show' => $show,
    'ticket_types' => $ticket_types,
    'recent_bookings' => $recentBookings,
    'user' => [
        'id' => $user_id,
        'name' => $_SESSION['user_name'] ?? '',
        'role' => $_SESSION['role'] ?? 'customer'
    ],
    'range' => $range
];

$database->closeConnection();

echo 'window.__BOOKING_DATA__ = ' . json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . ';';
