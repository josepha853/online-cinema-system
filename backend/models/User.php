<?php

class User {
    private $db;
    private $lastError = '';
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function register($name, $email, $password, $phone, $role = 'customer', $profile_photo = null) {
        $conn = $this->db->getConnection();
        
        if (!$conn) {
            $this->lastError = "Database connection failed";
            return false;
        }
        
        // Check if email already exists
        $check_stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
        $check_stmt->bind_param("s", $email);
        $check_stmt->execute();
        $result = $check_stmt->get_result();
        
        if ($result->num_rows > 0) {
            $check_stmt->close();
            $this->db->closeConnection();
            $this->lastError = 'Email already registered';
            return false;
        }
        $check_stmt->close();
        
        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, phone, role, wallet_balance, loyalty_points, profile_photo, created_at) VALUES (?, ?, ?, ?, ?, 0.00, 0, ?, NOW())");
        if (!$stmt) {
            $this->lastError = "Prepare failed: " . $conn->error;
            return false;
        }
        $stmt->bind_param("ssssss", $name, $email, $hashed_password, $phone, $role, $profile_photo);
        
        if ($stmt->execute()) {
            $user_id = $conn->insert_id;
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($user_id, "REGISTER", "users", $user_id);
            
            return $user_id;
        }
        
        return false;
    }

    public function getLastError() {
        return $this->lastError;
    }
    
    public function login($email, $password) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT user_id, name, email, password, phone, role, wallet_balance, loyalty_points FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            if (password_verify($password, $user['password'])) {
                // Remove password from session
                unset($user['password']);
                
                $stmt->close();
                $this->db->closeConnection();
                
                // Log audit
                log_audit($user['user_id'], "LOGIN", "users", $user['user_id']);
                
                return $user;
            }
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getUserById($user_id) {
        $conn = $this->db->getConnection();

        // Include password column for internal verification flows
        $stmt = $conn->prepare("SELECT user_id, name, email, password, phone, role, wallet_balance, loyalty_points, created_at FROM users WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            $stmt->close();
            $this->db->closeConnection();
            return $user;
        }

        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getAllUsers() {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT user_id, name, email, phone, role, wallet_balance, loyalty_points, created_at FROM users ORDER BY created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $users;
    }
    
    public function updateUser($user_id, $name, $email, $phone, $role) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE user_id = ?");
        $stmt->bind_param("ssssi", $name, $email, $phone, $role, $user_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($user_id, "UPDATE", "users", $user_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function deleteUser($user_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($user_id, "DELETE", "users", $user_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function updateWalletBalance($user_id, $amount) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE user_id = ?");
        $stmt->bind_param("di", $amount, $user_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($user_id, "WALLET_UPDATE", "users", $user_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function addLoyaltyPoints($user_id, $points) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("UPDATE users SET loyalty_points = loyalty_points + ? WHERE user_id = ?");
        $stmt->bind_param("ii", $points, $user_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($user_id, "LOYALTY_POINTS", "users", $user_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function checkFraud($email, $phone) {
        $conn = $this->db->getConnection();
        
        // Check for duplicate email or phone
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM users WHERE email = ? OR phone = ?");
        $stmt->bind_param("ss", $email, $phone);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        $stmt->close();
        $this->db->closeConnection();
        
        return $row['count'] > 0;
    }
}
?>
