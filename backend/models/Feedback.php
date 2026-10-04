<?php

class Feedback {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function createFeedback($user_id, $show_id, $rating, $comment) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("INSERT INTO feedback (user_id, show_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->bind_param("iiis", $user_id, $show_id, $rating, $comment);
        
        if ($stmt->execute()) {
            $feedback_id = $conn->insert_id;
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($user_id, "CREATE", "feedback", $feedback_id);
            
            return $feedback_id;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getFeedbackById($feedback_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT f.*, u.name as user_name, s.title as show_title FROM feedback f JOIN users u ON f.user_id = u.user_id JOIN shows s ON f.show_id = s.show_id WHERE f.feedback_id = ?");
        $stmt->bind_param("i", $feedback_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $feedback = $result->fetch_assoc();
            $stmt->close();
            $this->db->closeConnection();
            return $feedback;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getFeedbackByShow($show_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT f.*, u.name as user_name FROM feedback f JOIN users u ON f.user_id = u.user_id WHERE f.show_id = ? ORDER BY f.created_at DESC");
        $stmt->bind_param("i", $show_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $feedbacks = [];
        while ($row = $result->fetch_assoc()) {
            $feedbacks[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $feedbacks;
    }
    
    public function getAllFeedback() {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT f.*, u.name as user_name, s.title as show_title FROM feedback f JOIN users u ON f.user_id = u.user_id JOIN shows s ON f.show_id = s.show_id ORDER BY f.created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $feedbacks = [];
        while ($row = $result->fetch_assoc()) {
            $feedbacks[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $feedbacks;
    }
    
    public function getAverageRating($show_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews FROM feedback WHERE show_id = ?");
        $stmt->bind_param("i", $show_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        
        $this->db->closeConnection();
        
        return [
            'average_rating' => $row['average_rating'] ? round($row['average_rating'], 2) : 0,
            'total_reviews' => $row['total_reviews']
        ];
    }
    
    public function updateFeedback($feedback_id, $rating, $comment) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("UPDATE feedback SET rating = ?, comment = ? WHERE feedback_id = ? AND user_id = ?");
        $stmt->bind_param("isi", $rating, $comment, $feedback_id, $_SESSION['user_id']);
        
        if ($stmt->execute()) {
            $affected_rows = $stmt->affected_rows;
            $stmt->close();
            $this->db->closeConnection();
            
            if ($affected_rows > 0) {
                // Log audit
                log_audit($_SESSION['user_id'], "UPDATE", "feedback", $feedback_id);
                return true;
            }
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function deleteFeedback($feedback_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("DELETE FROM feedback WHERE feedback_id = ? AND user_id = ?");
        $stmt->bind_param("ii", $feedback_id, $_SESSION['user_id']);
        
        if ($stmt->execute()) {
            $affected_rows = $stmt->affected_rows;
            $stmt->close();
            $this->db->closeConnection();
            
            if ($affected_rows > 0) {
                // Log audit
                log_audit($_SESSION['user_id'], "DELETE", "feedback", $feedback_id);
                return true;
            }
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getTopRatedShows($limit = 10) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT s.show_id, s.title, s.poster_url, AVG(f.rating) as average_rating, COUNT(f.feedback_id) as total_reviews FROM shows s LEFT JOIN feedback f ON s.show_id = f.show_id GROUP BY s.show_id, s.title, s.poster_url HAVING total_reviews > 0 ORDER BY average_rating DESC, total_reviews DESC LIMIT ?");
        $stmt->bind_param("i", $limit);
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
    
    public function getUserFeedbackForShow($user_id, $show_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT * FROM feedback WHERE user_id = ? AND show_id = ?");
        $stmt->bind_param("ii", $user_id, $show_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $feedback = $result->fetch_assoc();
            $stmt->close();
            $this->db->closeConnection();
            return $feedback;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getFeedbackStats() {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT COUNT(*) as total_feedback, AVG(rating) as overall_average, MIN(rating) as lowest_rating, MAX(rating) as highest_rating FROM feedback");
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        
        $this->db->closeConnection();
        
        return [
            'total_feedback' => $row['total_feedback'],
            'overall_average' => $row['overall_average'] ? round($row['overall_average'], 2) : 0,
            'lowest_rating' => $row['lowest_rating'] ?: 0,
            'highest_rating' => $row['highest_rating'] ?: 0
        ];
    }
}
?>
