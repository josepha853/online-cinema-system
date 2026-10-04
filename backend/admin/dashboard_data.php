<?php
require_once __DIR__ . '/../config/connection.php';

header('Content-Type: application/javascript; charset=utf-8');

if (!is_logged_in() || get_user_role() !== 'admin') {
    echo "window.__ADMIN_DASHBOARD_DATA__ = null;";
    exit();
}

$range = sanitize_input($_GET['range'] ?? 'monthly');
$now = new DateTime();
$end = $now->format('Y-m-d 23:59:59');
switch ($range) {
    case 'daily':
        $now->modify('-1 day');
        break;
    case 'weekly':
        $now->modify('-7 days');
        break;
    case 'yearly':
        $now->modify('-365 days');
        break;
    case 'monthly':
    default:
        $now->modify('-30 days');
        break;
}
$start = $now->format('Y-m-d 00:00:00');

$db = new Database();
$conn = $db->getConnection();

$statsQueries = [
    'totalUsers' => 'SELECT COUNT(*) AS total FROM users',
    'totalMovies' => 'SELECT COUNT(*) AS total FROM shows',
    'totalTheaters' => 'SELECT COUNT(*) AS total FROM theaters',
    'totalBookings' => 'SELECT COUNT(*) AS total FROM orders',
    'todayBookings' => 'SELECT COUNT(*) AS total FROM orders WHERE DATE(created_at) = CURDATE()',
    'revenue' => "SELECT IFNULL(SUM(total_amount), 0) AS total FROM orders WHERE status IN ('confirmed','completed','paid')"
];

$stats = [];
foreach ($statsQueries as $key => $sql) {
    $result = $conn->query($sql);
    $stats[$key] = (int)($result->fetch_assoc()['total'] ?? 0);
}

$managementCounts = [
    'theaters' => (int)($conn->query('SELECT COUNT(*) AS total FROM theaters')->fetch_assoc()['total'] ?? 0),
    'auditoriums' => (int)($conn->query('SELECT COUNT(*) AS total FROM auditoriums')->fetch_assoc()['total'] ?? 0),
    'shows' => (int)($conn->query('SELECT COUNT(*) AS total FROM shows')->fetch_assoc()['total'] ?? 0),
    'ticketTypes' => (int)($conn->query('SELECT COUNT(*) AS total FROM ticket_types')->fetch_assoc()['total'] ?? 0)
];

$payload = [
    'range' => $range,
    'stats' => $stats,
    'management_counts' => $managementCounts,
    'report_data' => [],
    'fraud_alerts' => [],
    'audit_logs' => []
];

$rangeWindow = [$start, $end];

$occupancySql = "SELECT s.title, a.capacity, COUNT(oi.order_item_id) AS booked
    FROM shows s
    JOIN auditoriums a ON s.auditorium_id = a.aud_id
    LEFT JOIN orders o ON o.show_id = s.show_id AND o.status = 'confirmed' AND o.created_at BETWEEN ? AND ?
    LEFT JOIN order_items oi ON oi.order_id = o.order_id
    GROUP BY s.show_id, s.title, a.capacity
    ORDER BY booked DESC
    LIMIT 5";
$stmt = $conn->prepare($occupancySql);
$stmt->bind_param('ss', ...$rangeWindow);
$stmt->execute();
$occResult = $stmt->get_result();
$occupancy = [];
while ($row = $occResult->fetch_assoc()) {
    $rate = $row['capacity'] > 0 ? round(($row['booked'] / $row['capacity']) * 100, 2) : 0;
    $occupancy[] = [
        'show' => $row['title'],
        'rate' => "{$rate}%",
        'booked' => (int)$row['booked'],
        'capacity' => (int)$row['capacity']
    ];
}
$stmt->close();

$revenueByShow = [];
$revenueSql = "SELECT s.title, IFNULL(SUM(o.total_amount), 0) AS total
    FROM shows s
    LEFT JOIN orders o ON o.show_id = s.show_id AND o.status = 'confirmed' AND o.created_at BETWEEN ? AND ?
    GROUP BY s.show_id, s.title
    ORDER BY total DESC
    LIMIT 5";
$stmt = $conn->prepare($revenueSql);
$stmt->bind_param('ss', ...$rangeWindow);
$stmt->execute();
$revResult = $stmt->get_result();
while ($row = $revResult->fetch_assoc()) {
    $revenueByShow[] = [
        'show' => $row['title'],
        'amount' => (float)$row['total']
    ];
}
$stmt->close();

$moviePerformance = [];
$performanceSql = "SELECT s.title, COUNT(oi.order_item_id) AS seats_sold, IFNULL(AVG(f.rating), 0) AS rating
    FROM shows s
    LEFT JOIN orders o ON o.show_id = s.show_id AND o.status = 'confirmed' AND o.created_at BETWEEN ? AND ?
    LEFT JOIN order_items oi ON oi.order_id = o.order_id
    LEFT JOIN feedback f ON f.show_id = s.show_id
    GROUP BY s.show_id, s.title
    ORDER BY seats_sold DESC
    LIMIT 5";
$stmt = $conn->prepare($performanceSql);
$stmt->bind_param('ss', ...$rangeWindow);
$stmt->execute();
$perfResult = $stmt->get_result();
while ($row = $perfResult->fetch_assoc()) {
    $moviePerformance[] = [
        'movie' => $row['title'],
        'bookings' => (int)$row['seats_sold'],
        'rating' => round((float)$row['rating'], 2)
    ];
}
$stmt->close();

$dailySales = [];
$dailySql = "SELECT DATE(created_at) AS day, COUNT(*) AS tickets, IFNULL(SUM(total_amount), 0) AS revenue
    FROM orders
    WHERE status = 'confirmed' AND created_at BETWEEN ? AND ?
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) DESC
    LIMIT 7";
$stmt = $conn->prepare($dailySql);
$stmt->bind_param('ss', ...$rangeWindow);
$stmt->execute();
$dailyResult = $stmt->get_result();
while ($row = $dailyResult->fetch_assoc()) {
    $dailySales[] = [
        'date' => $row['day'],
        'tickets' => (int)$row['tickets'],
        'revenue' => (float)$row['revenue']
    ];
}
$stmt->close();

$revenueByTheater = [];
$theaterSql = "SELECT t.name, IFNULL(SUM(o.total_amount), 0) AS revenue
    FROM theaters t
    LEFT JOIN auditoriums a ON a.theater_id = t.theater_id
    LEFT JOIN shows s ON s.auditorium_id = a.aud_id
    LEFT JOIN orders o ON o.show_id = s.show_id AND o.status = 'confirmed' AND o.created_at BETWEEN ? AND ?
    GROUP BY t.theater_id, t.name
    ORDER BY revenue DESC
    LIMIT 5";
$stmt = $conn->prepare($theaterSql);
$stmt->bind_param('ss', ...$rangeWindow);
$stmt->execute();
$theaterResult = $stmt->get_result();
while ($row = $theaterResult->fetch_assoc()) {
    $revenueByTheater[] = [
        'name' => $row['name'],
        'revenue' => (float)$row['revenue']
    ];
}
$stmt->close();

$duplicates = [];
$dupSql = 'SELECT email, COUNT(*) AS count FROM users GROUP BY email HAVING count > 1 LIMIT 5';
$dupResult = $conn->query($dupSql);
while ($row = $dupResult->fetch_assoc()) {
    $duplicates[] = [
        'id' => count($duplicates) + 1,
        'issue' => 'Duplicate accounts detected',
        'detail' => "{$row['email']} registered {$row['count']} times",
        'severity' => 'warning'
    ];
}

$audits = [];
$stmt = $conn->prepare('SELECT al.*, u.email FROM audit_logs al LEFT JOIN users u ON u.user_id = al.user_id ORDER BY al.created_at DESC LIMIT 10');
$stmt->execute();
$auditResult = $stmt->get_result();
while ($row = $auditResult->fetch_assoc()) {
    $audits[] = [
        'id' => (int)$row['log_id'],
        'actor' => $row['email'] ?? 'System',
        'action' => $row['action'],
        'target' => $row['target_table'] . ' #' . $row['target_id'],
        'timestamp' => $row['created_at'],
        'status' => 'success'
    ];
}
$stmt->close();

$db->closeConnection();

$payload['report_data'] = [
    'occupancy' => $occupancy,
    'revenueByShow' => $revenueByShow,
    'moviePerformance' => $moviePerformance,
    'dailySales' => $dailySales,
    'revenueByTheater' => $revenueByTheater
];
$payload['fraud_alerts'] = $duplicates;
$payload['audit_logs'] = $audits;

echo 'window.__ADMIN_DASHBOARD_DATA__ = ' . json_encode($payload, JSON_UNESCAPED_SLASHES) . ";";
