<?php

class Order {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function createOrder($user_id, $show_id, $total_amount, $payment_method) {
        $conn = $this->db->getConnection();
        
        // Start transaction
        $conn->begin_transaction();
        
        try {
            // Insert order
            $stmt = $conn->prepare("INSERT INTO orders (user_id, show_id, total_amount, payment_method, status, created_at) VALUES (?, ?, ?, ?, 'pending', NOW())");
            $stmt->bind_param("idss", $user_id, $show_id, $total_amount, $payment_method);
            $stmt->execute();
            $order_id = $conn->insert_id;
            $stmt->close();
            
            // Log audit
            log_audit($user_id, "CREATE", "orders", $order_id);
            
            $conn->commit();
            $this->db->closeConnection();
            
            return $order_id;
            
        } catch (Exception $e) {
            $conn->rollback();
            $this->db->closeConnection();
            return false;
        }
    }
    
    public function addOrderItem($order_id, $ticket_type_id, $seat_number, $price) {
        $conn = $this->db->getConnection();
        
        // Start transaction
        $conn->begin_transaction();
        
        try {
            // Insert order item
            $stmt = $conn->prepare("INSERT INTO order_items (order_id, ticket_type_id, seat_number, price) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("iiid", $order_id, $ticket_type_id, $seat_number, $price);
            $stmt->execute();
            $order_item_id = $conn->insert_id;
            $stmt->close();
            
            // Update ticket type quantity
            $update_stmt = $conn->prepare("UPDATE ticket_types SET quantity_remaining = quantity_remaining - 1 WHERE type_id = ? AND quantity_remaining > 0");
            $update_stmt->bind_param("i", $ticket_type_id);
            $update_stmt->execute();
            $update_stmt->close();
            
            // Generate QR code
            $qr_code = generate_qr_code($order_item_id);
            
            // Create ticket
            $ticket_stmt = $conn->prepare("INSERT INTO tickets (order_item_id, qr_code_url, checked_in, canceled) VALUES (?, ?, 0, 0)");
            $ticket_stmt->bind_param("is", $order_item_id, $qr_code);
            $ticket_stmt->execute();
            $ticket_stmt->close();
            
            // Log audit
            log_audit($_SESSION['user_id'], "CREATE", "order_items", $order_item_id);
            
            $conn->commit();
            $this->db->closeConnection();
            
            return $order_item_id;
            
        } catch (Exception $e) {
            $conn->rollback();
            $this->db->closeConnection();
            return false;
        }
    }
    
    public function confirmOrder($order_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("UPDATE orders SET status = 'confirmed' WHERE order_id = ? AND status = 'pending'");
        $stmt->bind_param("i", $order_id);
        
        if ($stmt->execute()) {
            $affected_rows = $stmt->affected_rows;
            $stmt->close();
            $this->db->closeConnection();
            
            if ($affected_rows > 0) {
                // Log audit
                log_audit($_SESSION['user_id'], "CONFIRM", "orders", $order_id);
                
                // Send notification
                $order = $this->getOrderById($order_id);
                if ($order) {
                    send_notification($order['user_id'], "Your order #$order_id has been confirmed!", "success");
                }
                
                return true;
            }
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function cancelOrder($order_id) {
        $conn = $this->db->getConnection();
        
        // Start transaction
        $conn->begin_transaction();
        
        try {
            // Get order details
            $order = $this->getOrderById($order_id);
            if (!$order || $order['status'] !== 'confirmed') {
                throw new Exception("Order cannot be cancelled");
            }
            
            // Get order items to restore ticket quantities
            $items_stmt = $conn->prepare("SELECT ticket_type_id FROM order_items WHERE order_id = ?");
            $items_stmt->bind_param("i", $order_id);
            $items_stmt->execute();
            $items_result = $items_stmt->get_result();
            
            while ($item = $items_result->fetch_assoc()) {
                $restore_stmt = $conn->prepare("UPDATE ticket_types SET quantity_remaining = quantity_remaining + 1 WHERE type_id = ?");
                $restore_stmt->bind_param("i", $item['ticket_type_id']);
                $restore_stmt->execute();
                $restore_stmt->close();
            }
            $items_stmt->close();
            
            // Update order status
            $update_stmt = $conn->prepare("UPDATE orders SET status = 'cancelled' WHERE order_id = ?");
            $update_stmt->bind_param("i", $order_id);
            $update_stmt->execute();
            $update_stmt->close();
            
            // Update tickets as cancelled
            $ticket_stmt = $conn->prepare("UPDATE tickets t JOIN order_items oi ON t.order_item_id = oi.order_item_id SET t.canceled = 1 WHERE oi.order_id = ?");
            $ticket_stmt->bind_param("i", $order_id);
            $ticket_stmt->execute();
            $ticket_stmt->close();
            
            $conn->commit();
            $this->db->closeConnection();
            
            // Log audit
            log_audit($_SESSION['user_id'], "CANCEL", "orders", $order_id);
            
            // Send notification
            send_notification($order['user_id'], "Your order #$order_id has been cancelled.", "warning");
            
            return true;
            
        } catch (Exception $e) {
            $conn->rollback();
            $this->db->closeConnection();
            return false;
        }
    }
    
    public function getOrderById($order_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT o.*, u.name as user_name, u.email as user_email, s.title as show_title FROM orders o JOIN users u ON o.user_id = u.user_id JOIN shows s ON o.show_id = s.show_id WHERE o.order_id = ?");
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $order = $result->fetch_assoc();
            $stmt->close();
            $this->db->closeConnection();
            return $order;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return false;
    }
    
    public function getOrdersByUser($user_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT o.*, s.title as show_title, s.date as show_date, s.time as show_time FROM orders o JOIN shows s ON o.show_id = s.show_id WHERE o.user_id = ? ORDER BY o.created_at DESC");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $orders;
    }
    
    public function getAllOrders() {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT o.*, u.name as user_name, u.email as user_email, s.title as show_title, s.date as show_date, s.time as show_time FROM orders o JOIN users u ON o.user_id = u.user_id JOIN shows s ON o.show_id = s.show_id ORDER BY o.created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $orders;
    }
    
    public function getOrderItems($order_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT oi.*, tt.name as ticket_type_name, t.qr_code_url, t.checked_in, t.canceled FROM order_items oi JOIN ticket_types tt ON oi.ticket_type_id = tt.type_id JOIN tickets t ON oi.order_item_id = t.order_item_id WHERE oi.order_id = ?");
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $items;
    }
    
    public function checkSeatAvailability($show_id, $seat_numbers) {
        $conn = $this->db->getConnection();
        
        $placeholders = str_repeat('?,', count($seat_numbers) - 1) . '?';
        $types = str_repeat('i', count($seat_numbers));
        
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM order_items oi JOIN orders o ON oi.order_id = o.order_id WHERE oi.show_id = ? AND oi.seat_number IN ($placeholders) AND o.status = 'confirmed'");
        $params = array_merge([$show_id], $seat_numbers);
        $stmt->bind_param("i" . $types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        
        $this->db->closeConnection();
        
        return $row['count'] == 0; // Return true if no seats are booked
    }
    
    public function getRevenueByDateRange($start_date, $end_date) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT DATE(created_at) as date, SUM(total_amount) as revenue, COUNT(*) as orders FROM orders WHERE status = 'confirmed' AND created_at BETWEEN ? AND ? GROUP BY DATE(created_at) ORDER BY date");
        $stmt->bind_param("ss", $start_date, $end_date);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $revenue = [];
        while ($row = $result->fetch_assoc()) {
            $revenue[] = $row;
        }
        
        $stmt->close();
        $this->db->closeConnection();
        return $revenue;
    }
    
    public function getOccupancyByShow($show_id) {
        $conn = $this->db->getConnection();
        
        $stmt = $conn->prepare("SELECT COUNT(oi.order_item_id) as booked_seats, a.capacity FROM order_items oi JOIN orders o ON oi.order_id = o.order_id JOIN shows s ON o.show_id = s.show_id JOIN auditoriums a ON s.auditorium_id = a.aud_id WHERE o.show_id = ? AND o.status = 'confirmed'");
        $stmt->bind_param("i", $show_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        
        $this->db->closeConnection();
        
        if ($row && $row['capacity'] > 0) {
            return [
                'booked_seats' => $row['booked_seats'],
                'capacity' => $row['capacity'],
                'occupancy_rate' => ($row['booked_seats'] / $row['capacity']) * 100
            ];
        }
        
        return ['booked_seats' => 0, 'capacity' => 0, 'occupancy_rate' => 0];
    }
}
?>
