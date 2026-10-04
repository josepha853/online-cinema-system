<?php
require_once __DIR__ . '/../config/connection.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/Show.php';

header('Content-Type: application/javascript; charset=utf-8');

if (!is_logged_in()) {
    echo 'window.__MY_BOOKINGS_DATA__ = null;';
    exit();
}

$user_id = $_SESSION['user_id'];
$database = new Database();
$orderModel = new Order();
$showModel = new Show();

$bookings = $orderModel->getOrdersByUser($user_id);

$recent_show_ids = array_column($bookings, 'show_id');
$shows = [];
if (!empty($recent_show_ids)) {
    $placeholders = implode(',', array_fill(0, count($recent_show_ids), '?'));
    $stmt = $database->getConnection()->prepare("SELECT show_id, title, date, time, theater_name FROM shows WHERE show_id IN ($placeholders)");
    $types = str_repeat('i', count($recent_show_ids));
    $stmt->bind_param($types, ...$recent_show_ids);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $shows[$row['show_id']] = $row;
    }
    $stmt->close();
}

$payloadBookings = [];
foreach ($bookings as $booking) {
    $payloadBookings[] = array_merge($booking, [
        'show_details' => $shows[$booking['show_id']] ?? null
    ]);
}

$payload = [
    'bookings' => $payloadBookings,
    'user' => [
        'id' => $user_id,
        'name' => $_SESSION['user_name'] ?? '',
        'email' => $_SESSION['email'] ?? ''
    ]
];

$database->closeConnection();

echo 'window.__MY_BOOKINGS_DATA__ = ' . json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . ';';
