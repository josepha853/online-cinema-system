<?php
require_once '../config/connection.php';
require_once '../models/Order.php';
require_once '../models/Show.php';
require_once '../models/User.php';
require_once '../models/Theater.php';

class ExportController {
    private $conn;
    
    public function __construct() {
        global $conn;
        $this->conn = $conn;
    }
    
    /**
     * Export revenue report to CSV
     */
    public function exportRevenueCSV() {
        require_admin();
        
        $start_date = $_GET['start_date'] ?? date('Y-m-01');
        $end_date = $_GET['end_date'] ?? date('Y-m-d');
        
        // Fetch revenue data
        $stmt = $this->conn->prepare("
            SELECT 
                DATE(o.created_at) as date,
                s.title as show_title,
                t.name as theater_name,
                COUNT(o.order_id) as total_bookings,
                SUM(o.total_amount) as total_revenue,
                o.payment_method
            FROM orders o
            JOIN shows s ON o.show_id = s.show_id
            JOIN auditoriums a ON s.auditorium_id = a.aud_id
            JOIN theaters t ON a.theater_id = t.theater_id
            WHERE o.created_at BETWEEN ? AND ?
            AND o.status = 'paid'
            GROUP BY DATE(o.created_at), s.show_id, t.theater_id, o.payment_method
            ORDER BY date DESC
        ");
        
        $stmt->bind_param("ss", $start_date, $end_date);
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Set headers for CSV download
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="revenue_report_' . date('Y-m-d') . '.csv"');
        
        // Create output stream
        $output = fopen('php://output', 'w');
        
        // Add CSV headers
        fputcsv($output, ['Date', 'Show Title', 'Theater', 'Total Bookings', 'Total Revenue', 'Payment Method']);
        
        // Add data rows
        while ($row = $result->fetch_assoc()) {
            fputcsv($output, [
                $row['date'],
                $row['show_title'],
                $row['theater_name'],
                $row['total_bookings'],
                number_format($row['total_revenue'], 2),
                $row['payment_method']
            ]);
        }
        
        fclose($output);
        $stmt->close();
        exit();
    }
    
    /**
     * Export occupancy report to CSV
     */
    public function exportOccupancyCSV() {
        require_admin();
        
        $start_date = $_GET['start_date'] ?? date('Y-m-01');
        $end_date = $_GET['end_date'] ?? date('Y-m-d');
        
        // Fetch occupancy data
        $stmt = $this->conn->prepare("
            SELECT 
                s.show_id,
                s.title,
                s.date,
                s.time,
                t.name as theater_name,
                a.capacity,
                COUNT(DISTINCT oi.seat_number) as seats_sold,
                ROUND((COUNT(DISTINCT oi.seat_number) / a.capacity) * 100, 2) as occupancy_rate
            FROM shows s
            JOIN auditoriums a ON s.auditorium_id = a.aud_id
            JOIN theaters t ON a.theater_id = t.theater_id
            LEFT JOIN orders o ON s.show_id = o.show_id AND o.status = 'paid'
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            WHERE s.date BETWEEN ? AND ?
            GROUP BY s.show_id
            ORDER BY s.date DESC, s.time DESC
        ");
        
        $stmt->bind_param("ss", $start_date, $end_date);
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Set headers for CSV download
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="occupancy_report_' . date('Y-m-d') . '.csv"');
        
        $output = fopen('php://output', 'w');
        
        // Add CSV headers
        fputcsv($output, ['Show ID', 'Title', 'Date', 'Time', 'Theater', 'Capacity', 'Seats Sold', 'Occupancy %']);
        
        // Add data rows
        while ($row = $result->fetch_assoc()) {
            fputcsv($output, [
                $row['show_id'],
                $row['title'],
                $row['date'],
                $row['time'],
                $row['theater_name'],
                $row['capacity'],
                $row['seats_sold'],
                $row['occupancy_rate'] . '%'
            ]);
        }
        
        fclose($output);
        $stmt->close();
        exit();
    }
    
    /**
     * Export bookings report to CSV
     */
    public function exportBookingsCSV() {
        require_admin();
        
        $start_date = $_GET['start_date'] ?? date('Y-m-01');
        $end_date = $_GET['end_date'] ?? date('Y-m-d');
        
        $stmt = $this->conn->prepare("
            SELECT 
                o.order_id,
                u.name as customer_name,
                u.email,
                s.title as show_title,
                o.created_at,
                o.total_amount,
                o.payment_method,
                o.status,
                GROUP_CONCAT(oi.seat_number) as seats
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            JOIN shows s ON o.show_id = s.show_id
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            WHERE o.created_at BETWEEN ? AND ?
            GROUP BY o.order_id
            ORDER BY o.created_at DESC
        ");
        
        $stmt->bind_param("ss", $start_date, $end_date);
        $stmt->execute();
        $result = $stmt->get_result();
        
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="bookings_report_' . date('Y-m-d') . '.csv"');
        
        $output = fopen('php://output', 'w');
        fputcsv($output, ['Order ID', 'Customer', 'Email', 'Show', 'Booking Date', 'Amount', 'Payment Method', 'Status', 'Seats']);
        
        while ($row = $result->fetch_assoc()) {
            fputcsv($output, [
                $row['order_id'],
                $row['customer_name'],
                $row['email'],
                $row['show_title'],
                $row['created_at'],
                number_format($row['total_amount'], 2),
                $row['payment_method'],
                $row['status'],
                $row['seats']
            ]);
        }
        
        fclose($output);
        $stmt->close();
        exit();
    }
}

// Handle export requests
if (isset($_GET['action'])) {
    $exportController = new ExportController();
    
    switch ($_GET['action']) {
        case 'export_revenue_csv':
            $exportController->exportRevenueCSV();
            break;
        case 'export_occupancy_csv':
            $exportController->exportOccupancyCSV();
            break;
        case 'export_bookings_csv':
            $exportController->exportBookingsCSV();
            break;
        default:
            header("Location: ../admin/reports.php");
            break;
    }
} else {
    header("Location: ../admin/reports.php");
}
?>
