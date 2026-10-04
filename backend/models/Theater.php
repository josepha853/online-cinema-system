<?php

class Theater {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function createTheater($name, $address, $contact, $city) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("INSERT INTO theaters (name, address, contact, city, auditoriums_json) VALUES (?, ?, ?, ?, '[]')");
        $stmt->bind_param("ssss", $name, $address, $contact, $city);
        
        if ($stmt->execute()) {
            $theater_id = $conn->insert_id;
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "CREATE", "theaters", $theater_id);
            
            return $theater_id;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getTheaterById($theater_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT * FROM theaters WHERE theater_id = ?");
        $stmt->bind_param("i", $theater_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $theater = $result->fetch_assoc();
            $stmt->close();
            $this->db->closeConnection();
            return $theater;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getAllTheaters() {
        $conn = $this->db->getConnection();
        
        $sql = "SELECT 
                    t.*, 
                    t.contact as contact_phone,
                    'info@cinema.com' as contact_email,
                    (SELECT COUNT(*) FROM auditoriums a WHERE a.theater_id = t.theater_id) as total_auditoriums,
                    (SELECT COALESCE(AVG(f.rating), 0) 
                     FROM feedback f 
                     JOIN shows s ON f.show_id = s.show_id 
                     JOIN auditoriums a ON s.auditorium_id = a.aud_id 
                     WHERE a.theater_id = t.theater_id) as rating
                FROM theaters t 
                ORDER BY t.name ASC";
                
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $theaters = [];
        while ($row = $result->fetch_assoc()) {
            $theaters[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $theaters;
    }
    
    public function updateTheater($theater_id, $name, $address, $contact, $city) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("UPDATE theaters SET name = ?, address = ?, contact = ?, city = ? WHERE theater_id = ?");
        $stmt->bind_param("ssssi", $name, $address, $contact, $city, $theater_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "UPDATE", "theaters", $theater_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function deleteTheater($theater_id) {
        $conn = $this->db->getConnection();
        
        // Check if theater has associated auditoriums
        $check_stmt = $conn->prepare("SELECT COUNT(*) as count FROM auditoriums WHERE theater_id = ?");
        $check_stmt->bind_param("i", $theater_id);
        $check_stmt->execute();
        $result = $check_stmt->get_result();
        $row = $result->fetch_assoc();
        $check_stmt->close();
        
        if ($row['count'] > 0) {
            $this->db->closeConnection();
            return false; // Cannot delete theater with auditoriums
        }
        
        $stmt = $conn->prepare("DELETE FROM theaters WHERE theater_id = ?");
        $stmt->bind_param("i", $theater_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "DELETE", "theaters", $theater_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getTheatersByCity($city) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT * FROM theaters WHERE city = ? ORDER BY name ASC");
        $stmt->bind_param("s", $city);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $theaters = [];
        while ($row = $result->fetch_assoc()) {
            $theaters[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $theaters;
    }
    
    public function getCities() {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT DISTINCT city FROM theaters ORDER BY city ASC");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $cities = [];
        while ($row = $result->fetch_assoc()) {
            $cities[] = $row['city'];
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $cities;
    }
}
?>
