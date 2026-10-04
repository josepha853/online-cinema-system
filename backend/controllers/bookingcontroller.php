<?php
require_once '../config/connection.php';
require_once '../models/Order.php';
require_once '../models/TicketType.php';
require_once '../models/User.php';
require_once '../models/AuditLog.php';
require_once '../models/FraudDetection.php';
require_once '../models/QRCodeGenerator.php';

class BookingController {
    private $orderModel;
    private $ticketTypeModel;
    private $userModel;
    private $auditLog;
    private $fraudDetection;
    
    public function __construct() {
        $this->orderModel = new Order();
        $this->ticketTypeModel = new TicketType();
        $this->userModel = new User();
        $this->auditLog = new AuditLog();
        $this->fraudDetection = new FraudDetection();
    }
    
    public function createBooking() {
        // Check if user is logged in
        if (!isset($_SESSION['user_id'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Please login to create a booking'
            ]);
            exit();
        }
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $user_id = $_SESSION['user_id'];
            $show_id = (int)$_POST['show_id'];
            $ticket_type_id = isset($_POST['ticket_type_id']) ? (int)$_POST['ticket_type_id'] : 1;
            $seat_numbers = $_POST['seat_numbers']; // Array
            $payment_method = isset($_POST['payment_method']) ? sanitize_input($_POST['payment_method']) : 'cash';
            
            // Validation
            $errors = [];
            
            if (empty($show_id)) $errors[] = "Show is required";
            if (empty($seat_numbers) || !is_array($seat_numbers)) $errors[] = "Seat selection is required";
            if (empty($payment_method)) $errors[] = "Payment method is required";
            
            // Validate ticket type availability
            $ticket_type = $this->ticketTypeModel->getTicketTypeById($ticket_type_id);
            if (!$ticket_type) {
                $errors[] = "Invalid ticket type";
            } elseif (!$this->ticketTypeModel->checkAvailability($ticket_type_id, count($seat_numbers))) {
                $errors[] = "Not enough tickets available";
            }
            
            // Check seat availability
            if (!$this->orderModel->checkSeatAvailability($show_id, $seat_numbers)) {
                $errors[] = "One or more selected seats are already booked";
            }
            
            // Validate payment method and process payment
            $total_amount = $ticket_type['price'] * count($seat_numbers);
            
            if ($payment_method === 'wallet') {
                // Check wallet balance
                $user = $this->userModel->getUserById($user_id);
                if ($user['wallet_balance'] < $total_amount) {
                    $errors[] = "Insufficient wallet balance";
                }
            }
            
            // Fraud detection checks
            if ($this->fraudDetection->hasExceededBookingLimit($user_id)) {
                $errors[] = "You have exceeded the maximum number of bookings for today";
            }
            
            // Check for double booking
            foreach ($seat_numbers as $seat) {
                if ($this->fraudDetection->isSeatAlreadyBooked($show_id, $seat)) {
                    $errors[] = "Seat $seat is already booked";
                }
            }
            
            if (!empty($errors)) {
                echo json_encode([
                    'success' => false,
                    'message' => implode(', ', $errors)
                ]);
                exit();
            }
            
            // Create booking
            $order_id = $this->orderModel->createOrder($user_id, $show_id, $total_amount, $payment_method);
            
            if ($order_id) {
                // Log booking creation
                $this->auditLog->logAction($user_id, 'created_order', 'orders', $order_id);
                
                // Add order items and generate QR codes
                $success = true;
                foreach ($seat_numbers as $seat_number) {
                    $order_item_id = $this->orderModel->addOrderItem($order_id, $ticket_type_id, $seat_number, $ticket_type['price']);
                    if ($order_item_id) {
                        // Generate QR code for this ticket
                        $qr_data = [
                            'ticket_id' => $order_item_id,
                            'show_id' => $show_id,
                            'seat_number' => $seat_number,
                            'user_id' => $user_id
                        ];
                        $qr_path = QRCodeGenerator::generateTicketQR($qr_data);
                        
                        // Create ticket record with QR code
                        $dbTicket = new Database();
                        $connTicket = $dbTicket->getConnection();
                        $stmt = $connTicket->prepare("INSERT INTO tickets (order_item_id, qr_code_url) VALUES (?, ?)");
                        $stmt->bind_param("is", $order_item_id, $qr_path);
                        $stmt->execute();
                        $stmt->close();
                        $dbTicket->closeConnection();
                    } else {
                        $success = false;
                        break;
                    }
                }
                
                if ($success) {
                    // Process payment
                    $payment_processed = $this->processPayment($order_id, $payment_method, $total_amount);
                    
                    if ($payment_processed) {
                        // Confirm order
                        if ($this->orderModel->confirmOrder($order_id)) {
                            // Add loyalty points (1 point per $10 spent)
                            $loyalty_points = floor($total_amount / 10);
                            if ($loyalty_points > 0) {
                                $this->userModel->addLoyaltyPoints($user_id, $loyalty_points);
                            }
                            
                            // Log successful booking
                            $this->auditLog->logAction($user_id, 'confirmed_booking', 'orders', $order_id);
                            
                            // Return JSON response for API
                            echo json_encode([
                                'success' => true,
                                'message' => 'Booking confirmed successfully!',
                                'data' => [
                                    'order_id' => $order_id,
                                    'total_amount' => $total_amount,
                                    'loyalty_points_earned' => $loyalty_points
                                ]
                            ]);
                            exit();
                        }
                    }
                }
                
                // If we reach here, something went wrong
                echo json_encode([
                    'success' => false,
                    'message' => 'Booking failed. Please try again.'
                ]);
                exit();
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to create booking. Please try again.'
                ]);
                exit();
            }
        }
    }
    
    public function cancelBooking() {
        require_login();
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $order_id = (int)$_POST['order_id'];
            $user_id = $_SESSION['user_id'];
            
            // Get order details
            $order = $this->orderModel->getOrderById($order_id);
            
            if (!$order || $order['user_id'] !== $user_id) {
                $_SESSION['errors'] = ["Order not found or access denied"];
                header("Location: ../views/customer/bookings.php");
                exit();
            }
            
            // Check cancellation policy (at least 2 hours before showtime)
            $show_datetime = new DateTime($order['show_date'] . ' ' . $order['show_time']);
            $current_datetime = new DateTime();
            $interval = $current_datetime->diff($show_datetime);
            
            if ($interval->h < 2 || $show_datetime < $current_datetime) {
                $_SESSION['errors'] = ["Cannot cancel booking less than 2 hours before showtime"];
                header("Location: ../views/customer/bookings.php");
                exit();
            }
            
            // Cancel booking
            if ($this->orderModel->cancelOrder($order_id)) {
                // Refund to wallet if payment was made by wallet
                if ($order['payment_method'] === 'wallet') {
                    $this->userModel->updateWalletBalance($user_id, $order['total_amount']);
                }
                
                $_SESSION['success'] = "Booking cancelled successfully!";
                header("Location: ../views/customer/bookings.php");
                exit();
            } else {
                $_SESSION['errors'] = ["Failed to cancel booking. Please try again."];
                header("Location: ../views/customer/bookings.php");
                exit();
            }
        }
    }
    
    public function getBookingDetails() {
        require_login();
        
        if (isset($_GET['order_id'])) {
            $order_id = (int)$_GET['order_id'];
            $user_id = $_SESSION['user_id'];
            
            $order = $this->orderModel->getOrderById($order_id);
            
            if ($order && $order['user_id'] === $user_id) {
                $order_items = $this->orderModel->getOrderItems($order_id);
                
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => true,
                    'data' => [
                        'order' => $order,
                        'items' => $order_items
                    ]
                ]);
            } else {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'Order not found or access denied'
                ]);
            }
        }
    }
    
    public function getUserBookings() {
        require_login();
        
        $user_id = $_SESSION['user_id'];
        $bookings = $this->orderModel->getOrdersByUser($user_id);
        
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => $bookings
        ]);
    }
    
    public function checkSeatAvailability() {
        if (isset($_GET['show_id']) && isset($_GET['seat_numbers'])) {
            $show_id = (int)$_GET['show_id'];
            $seat_numbers = explode(',', $_GET['seat_numbers']);
            
            $available = $this->orderModel->checkSeatAvailability($show_id, $seat_numbers);
            
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'available' => $available
            ]);
        }
    }
    
    public function getAvailableSeats() {
        if (isset($_GET['auditorium_id']) && isset($_GET['show_id'])) {
            require_once '../models/Auditorium.php';
            $auditoriumModel = new Auditorium();
            
            $auditorium_id = (int)$_GET['auditorium_id'];
            $show_id = (int)$_GET['show_id'];
            
            $seats = $auditoriumModel->getAvailableSeats($auditorium_id, $show_id);
            
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'data' => $seats
            ]);
        }
    }
    
    private function processPayment($order_id, $payment_method, $amount) {
        // Simulate payment processing
        switch ($payment_method) {
            case 'wallet':
                // Wallet payment already validated above
                $user_id = $_SESSION['user_id'];
                $this->userModel->updateWalletBalance($user_id, -$amount);
                return true;
                
            case 'card':
                // Simulate credit card processing
                // In production, integrate with payment gateway
                return true;
                
            case 'cash':
                // Cash on delivery - mark as pending
                return true;
                
            default:
                return false;
        }
    }
}

// Handle requests
if (isset($_GET['action'])) {
    $bookingController = new BookingController();
    
    switch ($_GET['action']) {
        case 'create':
            $bookingController->createBooking();
            break;
        case 'cancel':
            $bookingController->cancelBooking();
            break;
        case 'get_details':
            $bookingController->getBookingDetails();
            break;
        case 'get_user_bookings':
            $bookingController->getUserBookings();
            break;
        case 'check_seats':
            $bookingController->checkSeatAvailability();
            break;
        case 'get_available_seats':
            $bookingController->getAvailableSeats();
            break;
        default:
            header("Location: ../views/customer/bookings.php");
            break;
    }
} else {
    header("Location: ../views/customer/bookings.php");
}
?>
