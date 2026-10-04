<?php

class TicketType {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function createTicketType($show_id, $name, $price, $quantity_total) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("INSERT INTO ticket_types (show_id, name, price, quantity_total, quantity_remaining) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("isdi", $show_id, $name, $price, $quantity_total, $quantity_total);
        
        if ($stmt->execute()) {
            $type_id = $conn->insert_id;
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "CREATE", "ticket_types", $type_id);
            
            return $type_id;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getTicketTypeById($type_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT tt.*, s.title as show_title, s.date as show_date, s.time as show_time FROM ticket_types tt JOIN shows s ON tt.show_id = s.show_id WHERE tt.type_id = ?");
        $stmt->bind_param("i", $type_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $ticket_type = $result->fetch_assoc();
            $stmt->close();
            $this->db->closeConnection();
            return $ticket_type;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getTicketTypesByShow($show_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT * FROM ticket_types WHERE show_id = ? ORDER BY price ASC");
        $stmt->bind_param("i", $show_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $ticket_types = [];
        while ($row = $result->fetch_assoc()) {
            $ticket_types[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $ticket_types;
    }
    
    public function getAllTicketTypes() {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT tt.*, s.title as show_title, s.date as show_date, s.time as show_time FROM ticket_types tt JOIN shows s ON tt.show_id = s.show_id ORDER BY s.date, s.time, tt.price");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $ticket_types = [];
        while ($row = $result->fetch_assoc()) {
            $ticket_types[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $ticket_types;
    }
    
    public function updateTicketType($type_id, $name, $price, $quantity_total) {
        $conn = $this->db->getConnection();
        
        // Get current quantity to calculate remaining
        $current_stmt = $conn->prepare("SELECT quantity_total, quantity_remaining FROM ticket_types WHERE type_id = ?");
        $current_stmt->bind_param("i", $type_id);
        $current_stmt->execute();
        $current_result = $current_stmt->get_result();
        $current = $current_result->fetch_assoc();
        $current_stmt->close();
        
        if (!$current) {
            $this->db->closeConnection();
            return false;
        }
        
        // Calculate new remaining quantity
        $sold = $current['quantity_total'] - $current['quantity_remaining'];
        $new_remaining = max(0, $quantity_total - $sold);
        
        $stmt = $conn->prepare("UPDATE ticket_types SET name = ?, price = ?, quantity_total = ?, quantity_remaining = ? WHERE type_id = ?");
        $stmt->bind_param("sdiii", $name, $price, $quantity_total, $new_remaining, $type_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "UPDATE", "ticket_types", $type_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function deleteTicketType($type_id) {
        $conn = $this->db->getConnection();
        
        // Check if ticket type has associated orders
        $check_stmt = $conn->prepare("SELECT COUNT(*) as count FROM order_items WHERE ticket_type_id = ?");
        $check_stmt->bind_param("i", $type_id);
        $check_stmt->execute();
        $result = $check_stmt->get_result();
        $row = $result->fetch_assoc();
        $check_stmt->close();
        
        if ($row['count'] > 0) {
            $this->db->closeConnection();
            return false; // Cannot delete ticket type with orders
        }
        
        $stmt = $conn->prepare("DELETE FROM ticket_types WHERE type_id = ?");
        $stmt->bind_param("i", $type_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "DELETE", "ticket_types", $type_id);
            
            return true;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function updateQuantity($type_id, $quantity_change) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("UPDATE ticket_types SET quantity_remaining = quantity_remaining + ? WHERE type_id = ? AND quantity_remaining + ? >= 0");
        $stmt->bind_param("iii", $quantity_change, $type_id, $quantity_change);
        
        if ($stmt->execute()) {
            $affected_rows = $stmt->affected_rows;
            $stmt->close();
            $this->db->closeConnection();
            
            if ($affected_rows > 0) {
                // Log audit
                log_audit($_SESSION['user_id'], "QUANTITY_UPDATE", "ticket_types", $type_id);
                return true;
            }
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function checkAvailability($type_id, $requested_quantity) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT quantity_remaining FROM ticket_types WHERE type_id = ?");
        $stmt->bind_param("i", $type_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $ticket_type = $result->fetch_assoc();
            $stmt->close();
            $this->db->closeConnection();
            
            return $ticket_type['quantity_remaining'] >= $requested_quantity;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
}
?>
