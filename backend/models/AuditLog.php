<?php

class AuditLog {
    private $conn;
    
    public function __construct() {
        global $conn;
        $this->conn = $conn;
    }
    
    /**
     * Log an action to the audit_logs table
     * @param int $user_id - ID of user performing action
     * @param string $action - Action performed (e.g., 'created_order', 'updated_show')
     * @param string $target_table - Table affected
     * @param int $target_id - ID of affected record
     * @return bool - Success status
     */
    public function logAction($user_id, $action, $target_table, $target_id = null) {
        $stmt = $this->conn->prepare("
            INSERT INTO audit_logs (user_id, action, target_table, target_id, created_at)
            VALUES (?, ?, ?, ?, NOW())
        ");
        
        $stmt->bind_param("issi", $user_id, $action, $target_table, $target_id);
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Get audit logs with optional filters
     */
    public function getAuditLogs($user_id = null, $limit = 100) {
        if ($user_id) {
            $stmt = $this->conn->prepare("
                SELECT al.*, u.name as user_name, u.email
                FROM audit_logs al
                LEFT JOIN users u ON al.user_id = u.user_id
                WHERE al.user_id = ?
                ORDER BY al.created_at DESC
                LIMIT ?
            ");
            $stmt->bind_param("ii", $user_id, $limit);
        } else {
            $stmt = $this->conn->prepare("
                SELECT al.*, u.name as user_name, u.email
                FROM audit_logs al
                LEFT JOIN users u ON al.user_id = u.user_id
                ORDER BY al.created_at DESC
                LIMIT ?
            ");
            $stmt->bind_param("i", $limit);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        $logs = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $logs;
    }
    
    /**
     * Get logs for a specific table/record
     */
    public function getLogsByTarget($target_table, $target_id) {
        $stmt = $this->conn->prepare("
            SELECT al.*, u.name as user_name
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.user_id
            WHERE al.target_table = ? AND al.target_id = ?
            ORDER BY al.created_at DESC
        ");
        
        $stmt->bind_param("si", $target_table, $target_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $logs = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $logs;
    }
    
    /**
     * Get recent activity summary
     */
    public function getRecentActivity($hours = 24) {
        $stmt = $this->conn->prepare("
            SELECT 
                action,
                target_table,
                COUNT(*) as count,
                MAX(created_at) as last_occurrence
            FROM audit_logs
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? HOUR)
            GROUP BY action, target_table
            ORDER BY count DESC
        ");
        
        $stmt->bind_param("i", $hours);
        $stmt->execute();
        $result = $stmt->get_result();
        $activity = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $activity;
    }
}
?>
