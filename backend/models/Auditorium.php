<?php

class Auditorium {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function createAuditorium($theater_id, $name, $capacity, $seating_map_url = null) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("INSERT INTO auditoriums (theater_id, name, seating_map_url, capacity) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("issi", $theater_id, $name, $seating_map_url, $capacity);
        
        if ($stmt->execute()) {
            $aud_id = $conn->insert_id;
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "CREATE", "auditoriums", $aud_id);
            
            return $aud_id;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getAuditoriumById($aud_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT a.*, t.name as theater_name, t.city FROM auditoriums a JOIN theaters t ON a.theater_id = t.theater_id WHERE a.aud_id = ?");
        $stmt->bind_param("i", $aud_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $auditorium = $result->fetch_assoc();
            $stmt->close();
            $this->db->closeConnection();
            return $auditorium;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getAuditoriumsByTheater($theater_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT * FROM auditoriums WHERE theater_id = ? ORDER BY name ASC");
        $stmt->bind_param("i", $theater_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $auditoriums = [];
        while ($row = $result->fetch_assoc()) {
            $auditoriums[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $auditoriums;
    }
    
    public function getAllAuditoriums() {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT a.*, t.name as theater_name, t.city FROM auditoriums a JOIN theaters t ON a.theater_id = t.theater_id ORDER BY t.name, a.name");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $auditoriums = [];
        while ($row = $result->fetch_assoc()) {
            $auditoriums[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $auditoriums;
    }
    
    public function updateAuditorium($aud_id, $theater_id, $name, $capacity, $seating_map_url = null) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("UPDATE auditoriums SET theater_id = ?, name = ?, capacity = ?, seating_map_url = ? WHERE aud_id = ?");
        $stmt->bind_param("isisi", $theater_id, $name, $capacity, $seating_map_url, $aud_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "UPDATE", "auditoriums", $aud_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function deleteAuditorium($aud_id) {
        $conn = $this->db->getConnection();
        
        // Check if auditorium has associated shows
        $check_stmt = $conn->prepare("SELECT COUNT(*) as count FROM shows WHERE auditorium_id = ?");
        $check_stmt->bind_param("i", $aud_id);
        $check_stmt->execute();
        $result = $check_stmt->get_result();
        $row = $result->fetch_assoc();
        $check_stmt->close();
        
        if ($row['count'] > 0) {
            $this->db->closeConnection();
            return false; // Cannot delete auditorium with shows
        }
        
        $stmt = $conn->prepare("DELETE FROM auditoriums WHERE aud_id = ?");
        $stmt->bind_param("i", $aud_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "DELETE", "auditoriums", $aud_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getAvailableSeats($aud_id, $show_id) {
        $conn = $this->db->getConnection();
        
        // Get auditorium capacity
        $aud_stmt = $conn->prepare("SELECT capacity FROM auditoriums WHERE aud_id = ?");
        $aud_stmt->bind_param("i", $aud_id);
        $aud_stmt->execute();
        $aud_result = $aud_stmt->get_result();
        $auditorium = $aud_result->fetch_assoc();
        $aud_stmt->close();
        
        if (!$auditorium) {
            $this->db->closeConnection();
            return [];
        }
        
        $capacity = $auditorium['capacity'];
        
        // Get booked seats for this show
        $book_stmt = $conn->prepare("SELECT seat_number FROM order_items oi JOIN orders o ON oi.order_id = o.order_id WHERE oi.show_id = ? AND o.status = 'confirmed'");
        $book_stmt->bind_param("i", $show_id);
        $book_stmt->execute();
        $book_result = $book_stmt->get_result();
        
        $booked_seats = [];
        while ($row = $book_result->fetch_assoc()) {
            $booked_seats[] = $row['seat_number'];
        }
        $book_stmt->close();
        
        // Generate all seats and mark availability
        $seats = [];
        for ($i = 1; $i <= $capacity; $i++) {
            $seats[] = [
                'seat_number' => $i,
                'status' => in_array($i, $booked_seats) ? 'booked' : 'available'
            ];
        }
        
        $this->db->closeConnection();
        return $seats;
    }
}
?>
