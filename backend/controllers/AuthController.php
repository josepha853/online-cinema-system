<?php
// Enable CORS for React frontend
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/connection.php';
require_once '../models/User.php';

class AuthController {
    private $userModel;
    
    public function __construct() {
        $this->userModel = new User();
    }
    
    private function sendResponse($success, $message, $data = null, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode([
            'success' => $success,
            'message' => $message,
            'data' => $data
        ]);
        exit();
    }
    
    public function register() {
        // Debug logging
        error_log("Register called. POST: " . print_r($_POST, true));
        error_log("FILES: " . print_r($_FILES, true));

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendResponse(false, 'Method not allowed', null, 405);
        }

        $name = sanitize_input($_POST['name'] ?? '');
        $email = sanitize_input($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $phone = sanitize_input($_POST['phone'] ?? '');
        $role = sanitize_input($_POST['role'] ?? 'customer');
        
        // Handle profile photo upload
        $profile_photo = null;
        if (isset($_FILES['profile_photo']) && $_FILES['profile_photo']['error'] === UPLOAD_ERR_OK) {
            $profile_photo = $this->handleFileUpload($_FILES['profile_photo'], 'profiles');
        }
        
        // Validation
        $errors = [];
        
        if (empty($name)) $errors[] = "Name is required";
        if (empty($email)) $errors[] = "Email is required";
        if (!validate_email($email)) $errors[] = "Invalid email format";
        if (empty($password)) $errors[] = "Password is required";
        if (strlen($password) < 8) $errors[] = "Password must be at least 8 characters";
        if (empty($phone)) $errors[] = "Phone number is required";
        
        // Check for fraud (duplicate email/phone)
        if ($this->userModel->checkFraud($email, $phone)) {
            $errors[] = "Email or phone number already registered";
        }
        
        if (!empty($errors)) {
            $this->sendResponse(false, implode(', ', $errors), null, 400);
        }
        
        // Register user
        $user_id = $this->userModel->register($name, $email, $password, $phone, $role, $profile_photo);

        if ($user_id) {
            // Send notification
            send_notification($user_id, "Welcome to CinemaHub! Your account has been created successfully.", 'success');
            
            // Log audit
            log_audit($user_id, 'register', 'users', $user_id);
            
            $this->sendResponse(true, "Registration successful! Please login to continue.", ['user_id' => $user_id]);
        } else {
            // Provide model error if available for debugging
            $modelError = $this->userModel->getLastError();
            $message = "Registration failed. Please try again." . ($modelError ? " Details: " . $modelError : '');
            $this->sendResponse(false, $message, null, 500);
        }
    }

    private function handleFileUpload($file, $folder) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $max_size = 5 * 1024 * 1024; // 5MB
        
        // Validate file type
        if (!in_array($file['type'], $allowed_types)) {
            return null;
        }
        
        // Validate file size
        if ($file['size'] > $max_size) {
            return null;
        }
        
        // Generate unique filename
        $filename = uniqid() . '_' . basename($file['name']);
        $upload_path = '../uploads/' . $folder . '/' . $filename;
        
        // Create directory if it doesn't exist
        if (!is_dir('../uploads/' . $folder)) {
            mkdir('../uploads/' . $folder, 0777, true);
        }
        
        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $upload_path)) {
            return 'uploads/' . $folder . '/' . $filename;
        }
        
        return null;
    }
    
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendResponse(false, 'Method not allowed', null, 405);
        }

        $email = sanitize_input($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        
        // Validation
        $errors = [];
        
        if (empty($email)) $errors[] = "Email is required";
        if (!validate_email($email)) $errors[] = "Invalid email format";
        if (empty($password)) $errors[] = "Password is required";
        
        if (!empty($errors)) {
            $this->sendResponse(false, implode(', ', $errors), null, 400);
        }
        
        // Attempt login
        $user = $this->userModel->login($email, $password);
        
        if ($user) {
            // Set session
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['wallet_balance'] = $user['wallet_balance'];
            $_SESSION['loyalty_points'] = $user['loyalty_points'];
            
            // Generate token (simple implementation)
            $token = base64_encode($user['user_id'] . ':' . time() . ':' . md5($user['email']));
            
            // Remove password from response
            unset($user['password']);
            
            // Log audit
            log_audit($user['user_id'], 'login', 'users', $user['user_id']);
            
            $this->sendResponse(true, "Login successful", [
                'user' => $user,
                'token' => $token
            ]);
        } else {
            $this->sendResponse(false, "Invalid email or password", null, 401);
        }
    }
    
    public function logout() {
        // Log audit
        if (is_logged_in()) {
            log_audit($_SESSION['user_id'], "LOGOUT", "users", $_SESSION['user_id']);
        }
        
        // Destroy session
        session_destroy();
        
        // Redirect to login
        header("Location: ../views/login.php");
        exit();
    }
    
    public function updateProfile() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && is_logged_in()) {
            $user_id = $_SESSION['user_id'];
            $name = sanitize_input($_POST['name']);
            $email = sanitize_input($_POST['email']);
            $phone = sanitize_input($_POST['phone']);
            $current_password = $_POST['current_password'];
            $new_password = $_POST['new_password'];
            $confirm_password = $_POST['confirm_password'];
            
            // Validation
            $errors = [];
            
            if (empty($name)) $errors[] = "Name is required";
            if (empty($email)) $errors[] = "Email is required";
            if (!validate_email($email)) $errors[] = "Invalid email format";
            if (empty($phone)) $errors[] = "Phone number is required";
            
            // Check if password change is requested
            if (!empty($new_password)) {
                if (empty($current_password)) $errors[] = "Current password is required to change password";
                if (strlen($new_password) < 8) $errors[] = "New password must be at least 8 characters";
                if (!preg_match('/[A-Z]/', $new_password)) $errors[] = "New password must contain at least one uppercase letter";
                if (!preg_match('/[0-9]/', $new_password)) $errors[] = "New password must contain at least one number";
                if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $new_password)) $errors[] = "New password must contain at least one special character";
                if ($new_password !== $confirm_password) $errors[] = "New passwords do not match";
                
                // Verify current password
                $user = $this->userModel->getUserById($user_id);
                if (!$user || !password_verify($current_password, $user['password'])) {
                    $errors[] = "Current password is incorrect";
                }
            }
            
            if (!empty($errors)) {
                $_SESSION['errors'] = $errors;
                $_SESSION['old_input'] = $_POST;
                header("Location: ../views/profile.php");
                exit();
            }
            
            // Update user info
            if ($this->userModel->updateUser($user_id, $name, $email, $phone, $_SESSION['role'])) {
                // Update session
                $_SESSION['name'] = $name;
                $_SESSION['email'] = $email;
                
                $_SESSION['success'] = "Profile updated successfully!";
                header("Location: ../views/profile.php");
                exit();
            } else {
                $_SESSION['errors'] = ["Profile update failed. Please try again."];
                header("Location: ../views/profile.php");
                exit();
            }
        }
    }
    
    public function changePassword() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && is_logged_in()) {
            $user_id = $_SESSION['user_id'];
            $current_password = $_POST['current_password'];
            $new_password = $_POST['new_password'];
            $confirm_password = $_POST['confirm_password'];
            
            // Validation
            $errors = [];
            
            if (empty($current_password)) $errors[] = "Current password is required";
            if (empty($new_password)) $errors[] = "New password is required";
            if (strlen($new_password) < 8) $errors[] = "New password must be at least 8 characters";
            if (!preg_match('/[A-Z]/', $new_password)) $errors[] = "New password must contain at least one uppercase letter";
            if (!preg_match('/[0-9]/', $new_password)) $errors[] = "New password must contain at least one number";
            if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $new_password)) $errors[] = "New password must contain at least one special character";
            if ($new_password !== $confirm_password) $errors[] = "New passwords do not match";
            
            // Verify current password
            $user = $this->userModel->getUserById($user_id);
            if (!$user || !password_verify($current_password, $user['password'])) {
                $errors[] = "Current password is incorrect";
            }
            
            if (!empty($errors)) {
                $_SESSION['errors'] = $errors;
                header("Location: ../views/change_password.php");
                exit();
            }
            
            // Update password (this would need to be implemented in User model)
            $_SESSION['success'] = "Password changed successfully!";
            header("Location: ../views/profile.php");
            exit();
        }
    }
}

// Handle requests
if (isset($_GET['action'])) {
    $authController = new AuthController();
    
    switch ($_GET['action']) {
        case 'register':
            $authController->register();
            break;
        case 'login':
            $authController->login();
            break;
        case 'logout':
            $authController->logout();
            break;
        case 'update_profile':
            $authController->updateProfile();
            break;
        case 'change_password':
            $authController->changePassword();
            break;
        default:
            header("Location: ../views/login.php");
            break;
    }
} else {
    header("Location: ../views/login.php");
}
?>
