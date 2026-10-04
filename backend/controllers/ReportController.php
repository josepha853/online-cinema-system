<?php
// Enable CORS for React frontend
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/connection.php';

class ReportController {
    private $database;

    public function __construct() {
        $this->database = new Database();
    }

    private function sendResponse(bool $success, array $data = [], string $message = '') {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => $success,
            'message' => $message,
            'data' => $data
        ]);
        exit();
    }

    private function getRangeWindow(string $range): array {
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
        return [$now->format('Y-m-d 00:00:00'), $end];
    }

    public function getDashboardStats() {
        require_admin();

        $conn = $this->database->getConnection();
        $stats = [];
        $counts = [];

        $queries = [
            'totalUsers' => "SELECT COUNT(*) as total FROM users",
            'totalMovies' => "SELECT COUNT(*) as total FROM shows",
            'totalTheaters' => "SELECT COUNT(*) as total FROM theaters",
            'totalBookings' => "SELECT COUNT(*) as total FROM orders",
            'todayBookings' => "SELECT COUNT(*) as total FROM orders WHERE DATE(created_at) = CURDATE()",
            'revenue' => "SELECT IFNULL(SUM(total_amount), 0) as total FROM orders WHERE status IN ('confirmed', 'completed')"
        ];

        foreach ($queries as $key => $sql) {
            $result = $conn->query($sql);
            $stats[$key] = $result->fetch_assoc()['total'] ?? 0;
        }

        $counts['theaters'] = $conn->query("SELECT COUNT(*) as total FROM theaters")->fetch_assoc()['total'] ?? 0;
        $counts['auditoriums'] = $conn->query("SELECT COUNT(*) as total FROM auditoriums")->fetch_assoc()['total'] ?? 0;
        $counts['shows'] = $conn->query("SELECT COUNT(*) as total FROM shows")->fetch_assoc()['total'] ?? 0;
        $counts['ticketTypes'] = $conn->query("SELECT COUNT(*) as total FROM ticket_types")->fetch_assoc()['total'] ?? 0;

        $this->database->closeConnection();
        $this->sendResponse(true, ['stats' => $stats, 'management_counts' => $counts]);
    }

    public function getReportData() {
        require_admin();

        $range = sanitize_input($_GET['range'] ?? 'monthly');
        [$start, $end] = $this->getRangeWindow($range);
        $conn = $this->database->getConnection();

        $occupancy = [];
        $occupancySql = "SELECT s.show_id, s.title, a.capacity, COUNT(oi.order_item_id) as booked
            FROM shows s
            JOIN auditoriums a ON s.auditorium_id = a.aud_id
            LEFT JOIN orders o ON o.show_id = s.show_id AND o.status = 'confirmed' AND o.created_at BETWEEN ? AND ?
            LEFT JOIN order_items oi ON oi.order_id = o.order_id
            GROUP BY s.show_id, s.title, a.capacity
            ORDER BY booked DESC
            LIMIT 5";
        $stmt = $conn->prepare($occupancySql);
        $stmt->bind_param('ss', $start, $end);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
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
        $revenueSql = "SELECT s.title, IFNULL(SUM(o.total_amount), 0) as total
            FROM shows s
            LEFT JOIN orders o ON o.show_id = s.show_id AND o.status = 'confirmed' AND o.created_at BETWEEN ? AND ?
            GROUP BY s.show_id, s.title
            ORDER BY total DESC
            LIMIT 5";
        $stmt = $conn->prepare($revenueSql);
        $stmt->bind_param('ss', $start, $end);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $revenueByShow[] = [
                'show' => $row['title'],
                'amount' => (float)$row['total']
            ];
        }
        $stmt->close();

        $moviePerformance = [];
        $performanceSql = "SELECT s.title, COUNT(oi.order_item_id) as seats_sold, IFNULL(AVG(f.rating), 0) as rating
            FROM shows s
            LEFT JOIN orders o ON o.show_id = s.show_id AND o.status = 'confirmed' AND o.created_at BETWEEN ? AND ?
            LEFT JOIN order_items oi ON oi.order_id = o.order_id
            LEFT JOIN feedback f ON f.show_id = s.show_id
            GROUP BY s.show_id, s.title
            ORDER BY seats_sold DESC
            LIMIT 5";
        $stmt = $conn->prepare($performanceSql);
        $stmt->bind_param('ss', $start, $end);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $moviePerformance[] = [
                'movie' => $row['title'],
                'bookings' => (int)$row['seats_sold'],
                'rating' => round((float)$row['rating'], 2)
            ];
        }
        $stmt->close();

        $dailySales = [];
        $dailySql = "SELECT DATE(created_at) as day, COUNT(*) as tickets, IFNULL(SUM(total_amount), 0) as revenue
            FROM orders
            WHERE status = 'confirmed' AND created_at BETWEEN ? AND ?
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) DESC
            LIMIT 7";
        $stmt = $conn->prepare($dailySql);
        $stmt->bind_param('ss', $start, $end);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $dailySales[] = [
                'date' => $row['day'],
                'tickets' => (int)$row['tickets'],
                'revenue' => (float)$row['revenue']
            ];
        }
        $stmt->close();

        $revenueByTheater = [];
        $theaterSql = "SELECT t.name, IFNULL(SUM(o.total_amount), 0) as revenue
            FROM theaters t
            LEFT JOIN auditoriums a ON a.theater_id = t.theater_id
            LEFT JOIN shows s ON s.auditorium_id = a.aud_id
            LEFT JOIN orders o ON o.show_id = s.show_id AND o.status = 'confirmed' AND o.created_at BETWEEN ? AND ?
            GROUP BY t.theater_id, t.name
            ORDER BY revenue DESC
            LIMIT 5";
        $stmt = $conn->prepare($theaterSql);
        $stmt->bind_param('ss', $start, $end);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $revenueByTheater[] = [
                'name' => $row['name'],
                'revenue' => (float)$row['revenue']
            ];
        }
        $stmt->close();

        $this->database->closeConnection();
        $this->sendResponse(true, [
            'occupancy' => $occupancy,
            'revenueByShow' => $revenueByShow,
            'moviePerformance' => $moviePerformance,
            'dailySales' => $dailySales,
            'revenueByTheater' => $revenueByTheater
        ]);
    }

    public function getFraudAlerts() {
        require_admin();

        $conn = $this->database->getConnection();
        $alerts = [];

        $duplicateSql = "SELECT email, COUNT(*) as count FROM users GROUP BY email HAVING count > 1 LIMIT 5";
        $result = $conn->query($duplicateSql);
        while ($row = $result->fetch_assoc()) {
            $alerts[] = [
                'id' => count($alerts) + 1,
                'issue' => 'Duplicate accounts detected',
                'detail' => "{$row['email']} registered {$row['count']} times",
                'severity' => 'warning'
            ];
        }

        $this->database->closeConnection();
        $this->sendResponse(true, $alerts);
    }

    public function getAuditLogs() {
        require_admin();

        $conn = $this->database->getConnection();
        $logs = [];

        $stmt = $conn->prepare("SELECT al.*, u.email FROM audit_logs al LEFT JOIN users u ON u.user_id = al.user_id ORDER BY al.created_at DESC LIMIT 10");
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $logs[] = [
                'id' => (int)$row['log_id'],
                'actor' => $row['email'] ?? 'System',
                'action' => $row['action'],
                'target' => $row['target_table'] . ' #' . $row['target_id'],
                'timestamp' => $row['created_at'],
                'status' => 'success'
            ];
        }
        $stmt->close();

        $this->database->closeConnection();
        $this->sendResponse(true, $logs);
    }

    public function exportRevenueReport() {
        require_admin();

        $range = sanitize_input($_GET['range'] ?? 'monthly');
        [$start, $end] = $this->getRangeWindow($range);
        $conn = $this->database->getConnection();

        $stmt = $conn->prepare("SELECT DATE(created_at) as day, COUNT(*) as tickets, IFNULL(SUM(total_amount), 0) as revenue
            FROM orders
            WHERE status = 'confirmed' AND created_at BETWEEN ? AND ?
            GROUP BY DATE(created_at)");
        $stmt->bind_param('ss', $start, $end);
        $stmt->execute();
        $result = $stmt->get_result();

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="revenue_report.csv"');
        $output = fopen('php://output', 'w');
        fputcsv($output, ['Date', 'Tickets', 'Revenue']);
        while ($row = $result->fetch_assoc()) {
            fputcsv($output, [$row['day'], $row['tickets'], $row['revenue']]);
        }
        fclose($output);

        $stmt->close();
        $this->database->closeConnection();
        exit();
    }

    public function exportOccupancyReport() {
        require_admin();

        $range = sanitize_input($_GET['range'] ?? 'monthly');
        [$start, $end] = $this->getRangeWindow($range);
        $conn = $this->database->getConnection();

        $sql = "SELECT s.title, a.capacity, COUNT(oi.order_item_id) as booked
            FROM shows s
            JOIN auditoriums a ON s.auditorium_id = a.aud_id
            LEFT JOIN orders o ON o.show_id = s.show_id AND o.status = 'confirmed' AND o.created_at BETWEEN ? AND ?
            LEFT JOIN order_items oi ON oi.order_id = o.order_id
            GROUP BY s.show_id, s.title, a.capacity";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $start, $end);
        $stmt->execute();
        $result = $stmt->get_result();

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="occupancy_report.csv"');
        $output = fopen('php://output', 'w');
        fputcsv($output, ['Show', 'Capacity', 'Booked', 'Occupancy Rate']);
        while ($row = $result->fetch_assoc()) {
            $rate = $row['capacity'] > 0 ? round(($row['booked'] / $row['capacity']) * 100, 2) . '%' : '0%';
            fputcsv($output, [$row['title'], $row['capacity'], $row['booked'], $rate]);
        }
        fclose($output);

        $stmt->close();
        $this->database->closeConnection();
        exit();
    }
}

if (isset($_GET['action'])) {
    $controller = new ReportController();
    switch ($_GET['action']) {
        case 'dashboard_stats':
            $controller->getDashboardStats();
            break;
        case 'report_data':
            $controller->getReportData();
            break;
        case 'fraud_alerts':
            $controller->getFraudAlerts();
            break;
        case 'audit_logs':
            $controller->getAuditLogs();
            break;
        case 'export_revenue':
            $controller->exportRevenueReport();
            break;
        case 'export_occupancy':
            $controller->exportOccupancyReport();
            break;
        default:
            header('HTTP/1.1 404 Not Found');
            echo 'Action not found';
            break;
    }
} else {
    header('HTTP/1.1 400 Bad Request');
    echo 'No action specified';
}
