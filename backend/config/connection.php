<?php
// Database configuration
class Database {
    private $host = "localhost";
    private $username = "root";
    private $password = "";
    private $database = "cinema";
    private $conn;
    
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->database);
            
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
            
            // Set charset to utf8mb4
            $this->conn->set_charset("utf8mb4");
            
        } catch(Exception $e) {
            // Log error instead of echoing
            error_log("Connection Error: " . $e->getMessage());
            return null;
        }
        
        return $this->conn;
    }
    
    public function closeConnection() {
        if ($this->conn !== null) {
            $this->conn->close();
        }
    }
}

// Error reporting settings (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers - Allow React frontend to communicate
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Session configuration for cross-origin (MUST be before session_start)
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_samesite', 'None');
    ini_set('session.cookie_secure', 'false'); // Set to true if using HTTPS
    ini_set('session.cookie_httponly', '1');
    session_set_cookie_params([
        'lifetime' => 3600,
        'path' => '/',
        'domain' => 'localhost',
        'secure' => false, // Set to true if using HTTPS
        'httponly' => true,
        'samesite' => 'None'
    ]);
    session_start();
}

// Security headers


// Helper functions
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function generate_qr_code($data) {
    // Simple QR code generation using text representation
    // In production, use a proper QR code library
    $qr_text = "TICKET-" . $data . "-" . time();
    return $qr_text;
}

function send_notification($user_id, $message, $type = 'info') {
    $database = new Database();
    $conn = $database->getConnection();
    
    $stmt = $conn->prepare("INSERT INTO notifications (user_id, message, type, sent_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("iss", $user_id, $message, $type);
    $stmt->execute();
    $stmt->close();
    
    $database->closeConnection();
}

function log_audit($user_id, $action, $target_table, $target_id) {
    $database = new Database();
    $conn = $database->getConnection();
    
    $stmt = $conn->prepare("INSERT INTO audit_logs (user_id, action, target_table, target_id, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("issi", $user_id, $action, $target_table, $target_id);
    $stmt->execute();
    $stmt->close();
    
    $database->closeConnection();
}

// Check if user is logged in
function is_logged_in() {
    return isset($_SESSION['user_id']);
}

// Check user role
function get_user_role() {
    return isset($_SESSION['role']) ? $_SESSION['role'] : 'guest';
}

// Redirect if not logged in - Fixed for API calls
function require_login() {
    if (!isset($_SESSION['user_id'])) {
        // For API calls, return JSON error instead of redirecting
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Authentication required. Please login.'
        ]);
        exit();
    }
}

// Redirect if not admin
function require_admin() {
    if (!is_logged_in() || get_user_role() !== 'admin') {
        header("Location: ../views/unauthorized.php");
        exit();
    }
}
?>
