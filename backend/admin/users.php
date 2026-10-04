<?php
include('../config/connection.php');
header("Content-Type: application/json");

// Read raw JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Determine request method
$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case 'GET':
        $result = $conn->query("SELECT user_id AS id, name, email, role, wallet_balance AS wallet, loyalty_points AS points FROM users");
        $users = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($users);
        break;

    case 'POST':
        $name = mysqli_real_escape_string($conn, $data['name']);
        $email = mysqli_real_escape_string($conn, $data['email']);
        $role = isset($data['role']) ? mysqli_real_escape_string($conn, $data['role']) : 'customer';
        $wallet = isset($data['wallet']) ? floatval($data['wallet']) : 0.00;
        $points = isset($data['points']) ? intval($data['points']) : 0;
        $password = password_hash('123456', PASSWORD_BCRYPT); // default password

        // Check duplicate email
        $check = $conn->query("SELECT * FROM users WHERE email='$email'");
        if($check->num_rows > 0){
            echo json_encode(['status'=>'error','message'=>'Email already exists']);
            exit;
        }

        $insert = $conn->query("INSERT INTO users (name,email,password,role,wallet_balance,loyalty_points) VALUES ('$name','$email','$password','$role','$wallet','$points')");
        if($insert){
            echo json_encode(['status'=>'success','message'=>'User added successfully']);
        } else {
            echo json_encode(['status'=>'error','message'=>$conn->error]);
        }
        break;

    case 'PUT':
        $id = intval($data['id']);
        $name = mysqli_real_escape_string($conn, $data['name']);
        $email = mysqli_real_escape_string($conn, $data['email']);
        $role = mysqli_real_escape_string($conn, $data['role']);
        $wallet = floatval($data['wallet']);
        $points = intval($data['points']);

        $update = $conn->query("UPDATE users SET name='$name', email='$email', role='$role', wallet_balance='$wallet', loyalty_points='$points' WHERE user_id='$id'");
        if($update){
            echo json_encode(['status'=>'success','message'=>'User updated successfully']);
        } else {
            echo json_encode(['status'=>'error','message'=>$conn->error]);
        }
        break;

    case 'DELETE':
        $id = intval($data['id']);
        $delete = $conn->query("DELETE FROM users WHERE user_id='$id'");
        if($delete){
            echo json_encode(['status'=>'success','message'=>'User deleted successfully']);
        } else {
            echo json_encode(['status'=>'error','message'=>$conn->error]);
        }
        break;

    default:
        echo json_encode(['status'=>'error','message'=>'Invalid request method']);
        break;
}
?>
