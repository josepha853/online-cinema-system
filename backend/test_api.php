<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once 'config/connection.php';

$response = [
    'status' => 'ok',
    'message' => 'Backend server is reachable',
    'database' => 'unknown',
    'timestamp' => date('c')
];

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    if ($conn) {
        $response['database'] = 'connected';
        $response['db_host'] = 'localhost'; // Do not expose real credentials
        
        // Check users table
        $result = $conn->query("SELECT count(*) as count FROM users");
        if ($result) {
            $row = $result->fetch_assoc();
            $response['user_count'] = $row['count'];
            
            // Check for profile_photo column
            $cols = $conn->query("SHOW COLUMNS FROM users LIKE 'profile_photo'");
            $response['has_profile_photo_column'] = ($cols && $cols->num_rows > 0);
        } else {
            $response['database_error'] = $conn->error;
        }
    } else {
        $response['database'] = 'failed';
    }
} catch (Exception $e) {
    $response['database'] = 'exception';
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
?>
