<?php
require_once '../config/connection.php';
require_once '../models/FraudDetection.php';
require_once '../models/AuditLog.php';

class FraudController {
    private $fraudDetection;
    private $auditLog;
    
    public function __construct() {
        $this->fraudDetection = new FraudDetection();
        $this->auditLog = new AuditLog();
    }
    
    /**
     * Get fraud detection dashboard
     */
    public function getFraudDashboard() {
        require_admin();
        
        header('Content-Type: application/json');
        
        $summary = $this->fraudDetection->getFraudSummary();
        
        // Log admin viewing fraud report
        if (isset($_SESSION['user_id'])) {
            $this->auditLog->logAction($_SESSION['user_id'], 'viewed_fraud_report', 'fraud_detection', null);
        }
        
        echo json_encode([
            'success' => true,
            'data' => $summary
        ]);
    }
    
    /**
     * Check specific user for fraud
     */
    public function checkUser() {
        require_admin();
        
        $user_id = (int)$_GET['user_id'];
        
        // Check booking limit
        $exceeded_limit = $this->fraudDetection->hasExceededBookingLimit($user_id);
        
        // Get user's bookings
        $database = new Database();
        $conn = $database->getConnection();
        $stmt = $conn->prepare("
            SELECT COUNT(*) as total_bookings,
                   SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_bookings,
                   SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings
            FROM orders
            WHERE user_id = ?
        ");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stats = $result->fetch_assoc();
        $stmt->close();
        $database->closeConnection();
        
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => [
                'user_id' => $user_id,
                'exceeded_booking_limit' => $exceeded_limit,
                'booking_stats' => $stats
            ]
        ]);
    }
}

// Handle requests
if (isset($_GET['action'])) {
    $fraudController = new FraudController();
    
    switch ($_GET['action']) {
        case 'get_dashboard':
            $fraudController->getFraudDashboard();
            break;
        case 'check_user':
            $fraudController->checkUser();
            break;
        default:
            header("Location: ../admin/fraud_detection.php");
            break;
    }
} else {
    header("Location: ../admin/fraud_detection.php");
}
?>
