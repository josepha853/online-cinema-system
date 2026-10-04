<?php
require_once '../config/connection.php';
require_once '../models/Show.php';
require_once '../models/Order.php';
require_once '../models/User.php';

class DashboardController {
    private $db;
    private $conn;

    public function __construct() {
        // Enable CORS
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Content-Type: application/json');

        // Handle preflight
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function getStaffDashboardData() {
        // Manual auth check for API
        if (!is_logged_in()) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Authentication required']);
            exit();
        }

        // Ensure user is staff or admin
        if ($_SESSION['role'] !== 'staff' && $_SESSION['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit();
        }

        $today = date('Y-m-d');
        
        // 1. Get Today's Shows with stats
        $todayShows = [];
        $sql = "SELECT s.show_id as id, s.title, s.time, t.name as theater, a.capacity, 
                (SELECT COUNT(*) FROM order_items oi 
                 JOIN orders o ON oi.order_id = o.order_id 
                 WHERE o.show_id = s.show_id AND o.status IN ('paid', 'confirmed', 'completed')) as booked,
                (SELECT COUNT(*) FROM tickets t 
                 JOIN order_items oi ON t.order_item_id = oi.order_item_id
                 JOIN orders o ON oi.order_id = o.order_id
                 WHERE o.show_id = s.show_id AND t.checked_in = 1) as checkedIn,
                s.status
                FROM shows s
                JOIN auditoriums a ON s.auditorium_id = a.aud_id
                JOIN theaters t ON a.theater_id = t.theater_id
                WHERE s.date = ?
                ORDER BY s.time ASC";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $today);
        $stmt->execute();
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
            // Determine status based on time if not explicitly set
            $showTime = strtotime($today . ' ' . $row['time']);
            $now = time();
            $status = $row['status'];
            
            if ($status === 'scheduled') {
                if ($now > $showTime + (3 * 3600)) { // 3 hours after start
                    $status = 'completed';
                } elseif ($now >= $showTime) {
                    $status = 'ongoing';
                } else {
                    $status = 'upcoming';
                }
            }
            
            $todayShows[] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'showtime' => $today . 'T' . $row['time'],
                'theater' => $row['theater'],
                'capacity' => $row['capacity'],
                'booked' => $row['booked'],
                'checkedIn' => $row['checkedIn'],
                'status' => $status
            ];
        }
        $stmt->close();

        // 2. Get Recent Check-ins (last 10)
        $recentCheckIns = [];
        $sql = "SELECT t.ticket_id as id, u.name as customerName, s.title as movie, oi.seat_number as seatNumber, 
                NOW() as checkInTime, 'checked_in' as status
                FROM tickets t
                JOIN order_items oi ON t.order_item_id = oi.order_item_id
                JOIN orders o ON oi.order_id = o.order_id
                JOIN users u ON o.user_id = u.user_id
                JOIN shows s ON o.show_id = s.show_id
                WHERE t.checked_in = 1 AND DATE(s.date) = ?
                ORDER BY t.ticket_id DESC LIMIT 10";
                
        // Note: In a real app, we'd have a checked_in_at timestamp column. 
        // For now using NOW() as placeholder or we could add that column.
        // Let's assume we just show the list.
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $today);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $recentCheckIns[] = $row;
        }
        $stmt->close();

        // 3. Stats
        $stats = [
            'todayShows' => count($todayShows),
            'totalCheckIns' => array_sum(array_column($todayShows, 'checkedIn')),
            'pendingTickets' => array_sum(array_column($todayShows, 'booked')) - array_sum(array_column($todayShows, 'checkedIn')),
            'completedShows' => count(array_filter($todayShows, function($s) { return $s['status'] === 'completed'; }))
        ];

        // 4. Notifications (Mock for now, or fetch from DB if table exists)
        $notifications = [
            ['id' => 1, 'message' => 'System check completed', 'type' => 'info', 'time' => '10 mins ago']
        ];

        echo json_encode([
            'success' => true,
            'data' => [
                'todayShows' => $todayShows,
                'recentCheckIns' => $recentCheckIns,
                'notifications' => $notifications,
                'stats' => $stats
            ]
        ]);
    }

    public function getCustomerDashboardData() {
        if (!is_logged_in()) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Authentication required']);
            exit();
        }
        $user_id = $_SESSION['user_id'];

        // 1. Stats
        $userModel = new User();
        $user = $userModel->getUserById($user_id);
        
        $sql = "SELECT COUNT(*) as total FROM orders WHERE user_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $totalBookings = $stmt->get_result()->fetch_assoc()['total'];
        $stmt->close();

        $sql = "SELECT COUNT(*) as upcoming FROM orders o 
                JOIN shows s ON o.show_id = s.show_id 
                WHERE o.user_id = ? AND CONCAT(s.date, ' ', s.time) > NOW() AND o.status IN ('paid', 'confirmed', 'completed')";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $upcomingBookings = $stmt->get_result()->fetch_assoc()['upcoming'];
        $stmt->close();

        $stats = [
            'totalBookings' => $totalBookings,
            'upcomingBookings' => $upcomingBookings,
            'walletBalance' => $user['wallet_balance'],
            'loyaltyPoints' => $user['loyalty_points']
        ];

        // 2. Upcoming Shows (Top 3)
        $upcomingShows = [];
        $sql = "SELECT s.show_id as id, s.title, s.poster_url as poster, s.genre, 
                CONCAT(s.date, 'T', s.time) as showtime, t.name as theater, 
                tt.price, s.duration, 
                (SELECT IFNULL(AVG(rating), 0) FROM feedback f WHERE f.show_id = s.show_id) as rating
                FROM shows s
                JOIN auditoriums a ON s.auditorium_id = a.aud_id
                JOIN theaters t ON a.theater_id = t.theater_id
                LEFT JOIN ticket_types tt ON s.show_id = tt.show_id
                WHERE CONCAT(s.date, ' ', s.time) > NOW() AND s.status = 'scheduled'
                GROUP BY s.show_id
                ORDER BY s.date ASC, s.time ASC LIMIT 3";
        
        $result = $this->conn->query($sql);
        while ($row = $result->fetch_assoc()) {
            $upcomingShows[] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'poster' => $row['poster'] ? 'http://localhost/cine/backend/' . $row['poster'] : 'https://via.placeholder.com/200x300?text=No+Poster',
                'genre' => $row['genre'],
                'rating' => round($row['rating'], 1),
                'showtime' => $row['showtime'],
                'theater' => $row['theater'],
                'price' => $row['price'],
                'duration' => $row['duration']
            ];
        }

        // 3. Recent Bookings
        $recentBookings = [];
        $sql = "SELECT o.order_id as id, s.title as movie, CONCAT(s.date, 'T', s.time) as showtime,
                t.name as theater, o.status, o.total_amount as amount,
                GROUP_CONCAT(oi.seat_number) as seats
                FROM orders o
                JOIN shows s ON o.show_id = s.show_id
                JOIN auditoriums a ON s.auditorium_id = a.aud_id
                JOIN theaters t ON a.theater_id = t.theater_id
                JOIN order_items oi ON o.order_id = oi.order_id
                WHERE o.user_id = ?
                GROUP BY o.order_id
                ORDER BY o.created_at DESC LIMIT 5";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $recentBookings[] = [
                'id' => $row['id'],
                'movie' => $row['movie'],
                'showtime' => $row['showtime'],
                'theater' => $row['theater'],
                'seats' => explode(',', $row['seats']),
                'status' => $row['status'],
                'amount' => $row['amount'],
                'qrCode' => 'QR' . $row['id'] // Simple placeholder
            ];
        }
        $stmt->close();

        // 4. Notifications
        $notifications = [];
        $sql = "SELECT notif_id as id, message, type, sent_at as time FROM notifications WHERE user_id = ? ORDER BY sent_at DESC LIMIT 5";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $notifications[] = $row;
        }
        $stmt->close();

        echo json_encode([
            'success' => true,
            'data' => [
                'upcomingShows' => $upcomingShows,
                'recentBookings' => $recentBookings,
                'notifications' => $notifications,
                'stats' => $stats
            ]
        ]);
    }
}

// Handle requests
if (isset($_GET['action'])) {
    $controller = new DashboardController();
    
    switch ($_GET['action']) {
        case 'staff_stats':
            $controller->getStaffDashboardData();
            break;
        case 'customer_stats':
            $controller->getCustomerDashboardData();
            break;
        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            break;
    }
}
?>
