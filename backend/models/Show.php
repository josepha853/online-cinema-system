<?php

class Show {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function createShow($auditorium_id, $title, $type, $language, $genre, $date, $time, $duration, $poster_url = null) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("INSERT INTO shows (auditorium_id, title, type, language, genre, date, time, duration, status, poster_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', ?)");
        $stmt->bind_param("issssssis", $auditorium_id, $title, $type, $language, $genre, $date, $time, $duration, $poster_url);
        
        if ($stmt->execute()) {
            $show_id = $conn->insert_id;
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "CREATE", "shows", $show_id);
            
            return $show_id;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getShowById($show_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT s.*, a.name as auditorium_name, a.capacity, t.name as theater_name, t.city FROM shows s JOIN auditoriums a ON s.auditorium_id = a.aud_id JOIN theaters t ON a.theater_id = t.theater_id WHERE s.show_id = ?");
        $stmt->bind_param("i", $show_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $show = $result->fetch_assoc();
            $stmt->close();
            $this->db->closeConnection();
            return $show;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getAllShows() {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT s.*, a.name as auditorium_name, t.name as theater_name, t.city FROM shows s JOIN auditoriums a ON s.auditorium_id = a.aud_id JOIN theaters t ON a.theater_id = t.theater_id ORDER BY s.date, s.time");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $shows = [];
        while ($row = $result->fetch_assoc()) {
            $shows[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $shows;
    }
    
    public function getShowsByDate($date) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT s.*, a.name as auditorium_name, t.name as theater_name, t.city FROM shows s JOIN auditoriums a ON s.auditorium_id = a.aud_id JOIN theaters t ON a.theater_id = t.theater_id WHERE s.date = ? ORDER BY s.time");
        $stmt->bind_param("s", $date);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $shows = [];
        while ($row = $result->fetch_assoc()) {
            $shows[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $shows;
    }
    
    public function getShowsByTheater($theater_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT s.*, a.name as auditorium_name FROM shows s JOIN auditoriums a ON s.auditorium_id = a.aud_id WHERE a.theater_id = ? AND s.date >= CURDATE() ORDER BY s.date, s.time");
        $stmt->bind_param("i", $theater_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $shows = [];
        while ($row = $result->fetch_assoc()) {
            $shows[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $shows;
    }
    
    public function updateShow($show_id, $auditorium_id, $title, $type, $language, $genre, $date, $time, $duration, $status, $poster_url = null) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("UPDATE shows SET auditorium_id = ?, title = ?, type = ?, language = ?, genre = ?, date = ?, time = ?, duration = ?, status = ?, poster_url = ? WHERE show_id = ?");
        $stmt->bind_param("issssssssi", $auditorium_id, $title, $type, $language, $genre, $date, $time, $duration, $status, $poster_url, $show_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "UPDATE", "shows", $show_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function deleteShow($show_id) {
        $conn = $this->db->getConnection();
        
        // Check if show has associated ticket types
        $check_stmt = $conn->prepare("SELECT COUNT(*) as count FROM ticket_types WHERE show_id = ?");
        $check_stmt->bind_param("i", $show_id);
        $check_stmt->execute();
        $result = $check_stmt->get_result();
        $row = $result->fetch_assoc();
        $check_stmt->close();
        
        if ($row['count'] > 0) {
            $this->db->closeConnection();
            return false; // Cannot delete show with ticket types
        }
        
        $stmt = $conn->prepare("DELETE FROM shows WHERE show_id = ?");
        $stmt->bind_param("i", $show_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "DELETE", "shows", $show_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function searchShows($search_term, $city = null, $date = null) {
        $conn = $this->db->getConnection();
        
        $query = "SELECT s.*, a.name as auditorium_name, t.name as theater_name, t.city FROM shows s JOIN auditoriums a ON s.auditorium_id = a.aud_id JOIN theaters t ON a.theater_id = t.theater_id WHERE (s.title LIKE ? OR s.genre LIKE ? OR s.language LIKE ?)";
        $params = ["%$search_term%", "%$search_term%", "%$search_term%"];
        $types = "sss";
        
        if ($city) {
            $query .= " AND t.city = ?";
            $params[] = $city;
            $types .= "s";
        }
        
        if ($date) {
            $query .= " AND s.date = ?";
            $params[] = $date;
            $types .= "s";
        }
        
        $query .= " ORDER BY s.date, s.time";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $shows = [];
        while ($row = $result->fetch_assoc()) {
            $shows[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $shows;
    }
    
    public function getUpcomingShows() {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT s.*, a.name as auditorium_name, t.name as theater_name, t.city FROM shows s JOIN auditoriums a ON s.auditorium_id = a.aud_id JOIN theaters t ON a.theater_id = t.theater_id WHERE s.date >= CURDATE() AND s.status = 'scheduled' ORDER BY s.date, s.time LIMIT 10");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $shows = [];
        while ($row = $result->fetch_assoc()) {
            $shows[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $shows;
    }
}
?>
