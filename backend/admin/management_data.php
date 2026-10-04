<?php
require_once __DIR__ . '/../config/connection.php';

require_admin();
header('Content-Type: application/javascript; charset=utf-8');

$database = new Database();
$conn = $database->getConnection();

$statQueries = [
    'totalUsers' => "SELECT COUNT(*) AS total FROM users",
    'totalShows' => "SELECT COUNT(*) AS total FROM shows",
    'totalTheaters' => "SELECT COUNT(*) AS total FROM theaters",
    'totalOrders' => "SELECT COUNT(*) AS total FROM orders",
    'todayOrders' => "SELECT COUNT(*) AS total FROM orders WHERE DATE(created_at) = CURDATE()",
    'revenue' => "SELECT IFNULL(SUM(total_amount), 0) AS total FROM orders WHERE status IN ('confirmed','completed')"
];

$stats = [];
foreach ($statQueries as $key => $sql) {
    $result = $conn->query($sql);
    $stats[$key] = (int)($result->fetch_assoc()['total'] ?? 0);
}

$managementCounts = [
    'theaters' => (int)($conn->query('SELECT COUNT(*) AS total FROM theaters')->fetch_assoc()['total'] ?? 0),
    'auditoriums' => (int)($conn->query('SELECT COUNT(*) AS total FROM auditoriums')->fetch_assoc()['total'] ?? 0),
    'shows' => (int)($conn->query('SELECT COUNT(*) AS total FROM shows')->fetch_assoc()['total'] ?? 0),
    'ticketTypes' => (int)($conn->query('SELECT COUNT(*) AS total FROM ticket_types')->fetch_assoc()['total'] ?? 0),
    'orders' => (int)($conn->query('SELECT COUNT(*) AS total FROM orders')->fetch_assoc()['total'] ?? 0)
];

$payload = [
    'stats' => $stats,
    'management_counts' => $managementCounts,
    'timestamp' => date('Y-m-d H:i:s')
];

echo 'window.__MANAGEMENT_DATA__ = ' . json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . ';';
$database->closeConnection();
