<?php

class FraudDetection {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    /**
     * Check for duplicate accounts by email or phone
     * @return array - List of potential duplicate accounts
     */
    public function detectDuplicateAccounts() {
        // Find users with same email (case-insensitive)
        $email_duplicates = [];
        $stmt = $this->conn->prepare("
            SELECT email, COUNT(*) as count, GROUP_CONCAT(user_id) as user_ids
            FROM users
            GROUP BY LOWER(email)
            HAVING count > 1
        ");
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $email_duplicates[] = $row;
        }
        $stmt->close();
        
        // Find users with same phone
        $phone_duplicates = [];
        $stmt = $this->conn->prepare("
            SELECT phone, COUNT(*) as count, GROUP_CONCAT(user_id) as user_ids
            FROM users
            WHERE phone IS NOT NULL AND phone != ''
            GROUP BY phone
            HAVING count > 1
        ");
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $phone_duplicates[] = $row;
        }
        $stmt->close();
        
        return [
            'email_duplicates' => $email_duplicates,
            'phone_duplicates' => $phone_duplicates
        ];
    }
    
    /**
     * Check if a seat is already booked for a show
     * @param int $show_id
     * @param string $seat_number
     * @return bool - True if seat is already booked
     */
    public function isSeatAlreadyBooked($show_id, $seat_number) {
        $stmt = $this->conn->prepare("
            SELECT COUNT(*) as count
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.order_id
            WHERE o.show_id = ? 
            AND oi.seat_number = ?
            AND o.status != 'cancelled'
        ");
        
        $stmt->bind_param("is", $show_id, $seat_number);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        
        return $row['count'] > 0;
    }
    
    /**
     * Detect multiple bookings by same user for same show
     * @return array - List of suspicious bookings
     */
    public function detectMultipleBookingsSameShow() {
        $stmt = $this->conn->prepare("
            SELECT 
                u.user_id,
                u.name,
                u.email,
                o.show_id,
                s.title as show_title,
                COUNT(o.order_id) as booking_count,
                GROUP_CONCAT(o.order_id) as order_ids
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            JOIN shows s ON o.show_id = s.show_id
            WHERE o.status != 'cancelled'
            GROUP BY u.user_id, o.show_id
            HAVING booking_count > 1
        ");
        
        $stmt->execute();
        $result = $stmt->get_result();
        $suspicious = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $suspicious;
    }
    
    /**
     * Detect potential fake payments
     * Check for orders marked as paid but with suspicious patterns
     * @return array - List of suspicious payments
     */
    public function detectFakePayments() {
        // Find orders marked as paid but created very quickly (< 2 seconds apart)
        // or with unusual payment patterns
        $stmt = $this->conn->prepare("
            SELECT 
                o1.order_id,
                o1.user_id,
                u.name,
                u.email,
                o1.total_amount,
                o1.payment_method,
                o1.created_at,
                COUNT(o2.order_id) as rapid_orders
            FROM orders o1
            JOIN users u ON o1.user_id = u.user_id
            LEFT JOIN orders o2 ON o1.user_id = o2.user_id 
                AND ABS(TIMESTAMPDIFF(SECOND, o1.created_at, o2.created_at)) < 2
                AND o1.order_id != o2.order_id
            WHERE o1.status = 'paid'
            GROUP BY o1.order_id
            HAVING rapid_orders > 0
        ");
        
        $stmt->execute();
        $result = $stmt->get_result();
        $suspicious = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $suspicious;
    }
    
    /**
     * Check if user has exceeded booking limit
     * @param int $user_id
     * @param int $limit - Max bookings per day
     * @return bool
     */
    public function hasExceededBookingLimit($user_id, $limit = 10) {
        $stmt = $this->conn->prepare("
            SELECT COUNT(*) as count
            FROM orders
            WHERE user_id = ?
            AND DATE(created_at) = CURDATE()
            AND status != 'cancelled'
        ");
        
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        
        return $row['count'] >= $limit;
    }
    
    /**
     * Get fraud detection summary
     * @return array - Summary of all fraud checks
     */
    public function getFraudSummary() {
        return [
            'duplicate_accounts' => $this->detectDuplicateAccounts(),
            'multiple_bookings' => $this->detectMultipleBookingsSameShow(),
            'fake_payments' => $this->detectFakePayments(),
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
}
?>
