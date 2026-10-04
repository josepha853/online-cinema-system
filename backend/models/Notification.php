<?php

class Notification {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function createNotification($user_id, $message, $type = 'info') {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("INSERT INTO notifications (user_id, message, type, sent_at) VALUES (?, ?, ?, NOW())");
        $stmt->bind_param("iss", $user_id, $message, $type);
        
        if ($stmt->execute()) {
            $notif_id = $conn->insert_id;
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($user_id, "CREATE", "notifications", $notif_id);
            
            return $notif_id;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getUserNotifications($user_id, $limit = 10) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY sent_at DESC LIMIT ?");
        $stmt->bind_param("ii", $user_id, $limit);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $notifications = [];
        while ($row = $result->fetch_assoc()) {
            $notifications[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $notifications;
    }
    
    public function markAsRead($notif_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("UPDATE notifications SET read_at = NOW() WHERE notif_id = ?");
        $stmt->bind_param("i", $notif_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "READ", "notifications", $notif_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function deleteNotification($notif_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("DELETE FROM notifications WHERE notif_id = ?");
        $stmt->bind_param("i", $notif_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "DELETE", "notifications", $notif_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getUnreadCount($user_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read_at IS NULL");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        
        $this->db->closeConnection();
        return $row['count'];
    }
    
    public function broadcastNotification($message, $type = 'info', $role = null) {
        $conn = $this->db->getConnection();
        
        if ($role) {
            $stmt = $conn->prepare("INSERT INTO notifications (user_id, message, type, sent_at) SELECT user_id, ?, ?, NOW() FROM users WHERE role = ?");
            $stmt->bind_param("sss", $message, $type, $role);
        } else {
            $stmt = $conn->prepare("INSERT INTO notifications (user_id, message, type, sent_at) SELECT user_id, ?, ?, NOW() FROM users");
            $stmt->bind_param("ss", $message, $type);
        }
        
        if ($stmt->execute()) {
            $affected_rows = $stmt->affected_rows;
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "BROADCAST", "notifications", 0);
            
            return $affected_rows;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
}
?>
