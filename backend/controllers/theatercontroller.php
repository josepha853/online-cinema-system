<?php
require_once '../config/connection.php';
require_once '../models/Theater.php';

class TheaterController {
    private $theaterModel;
    
    public function __construct() {
        $this->theaterModel = new Theater();
    }
    
    public function create() {
        require_admin();
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $name = sanitize_input($_POST['name']);
            $address = sanitize_input($_POST['address']);
            $contact = sanitize_input($_POST['contact']);
            $city = sanitize_input($_POST['city']);
            
            // Validation
            $errors = [];
            
            if (empty($name)) $errors[] = "Theater name is required";
            if (empty($address)) $errors[] = "Address is required";
            if (empty($contact)) $errors[] = "Contact number is required";
            if (empty($city)) $errors[] = "City is required";
            
            if (!empty($errors)) {
                $_SESSION['errors'] = $errors;
                $_SESSION['old_input'] = $_POST;
                header("Location: ../views/admin/theaters/create.php");
                exit();
            }
            
            // Create theater
            $theater_id = $this->theaterModel->createTheater($name, $address, $contact, $city);
            
            if ($theater_id) {
                $_SESSION['success'] = "Theater created successfully!";
                header("Location: ../views/admin/theaters/index.php");
                exit();
            } else {
                $_SESSION['errors'] = ["Failed to create theater. Please try again."];
                $_SESSION['old_input'] = $_POST;
                header("Location: ../views/admin/theaters/create.php");
                exit();
            }
        }
    }
    
    public function update() {
        require_admin();
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $theater_id = (int)$_POST['theater_id'];
            $name = sanitize_input($_POST['name']);
            $address = sanitize_input($_POST['address']);
            $contact = sanitize_input($_POST['contact']);
            $city = sanitize_input($_POST['city']);
            
            // Validation
            $errors = [];
            
            if (empty($theater_id)) $errors[] = "Theater ID is required";
            if (empty($name)) $errors[] = "Theater name is required";
            if (empty($address)) $errors[] = "Address is required";
            if (empty($contact)) $errors[] = "Contact number is required";
            if (empty($city)) $errors[] = "City is required";
            
            if (!empty($errors)) {
                $_SESSION['errors'] = $errors;
                $_SESSION['old_input'] = $_POST;
                header("Location: ../views/admin/theaters/edit.php?id=$theater_id");
                exit();
            }
            
            // Update theater
            if ($this->theaterModel->updateTheater($theater_id, $name, $address, $contact, $city)) {
                $_SESSION['success'] = "Theater updated successfully!";
                header("Location: ../views/admin/theaters/index.php");
                exit();
            } else {
                $_SESSION['errors'] = ["Failed to update theater. Please try again."];
                $_SESSION['old_input'] = $_POST;
                header("Location: ../views/admin/theaters/edit.php?id=$theater_id");
                exit();
            }
        }
    }
    
    public function delete() {
        require_admin();
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $theater_id = (int)$_POST['theater_id'];
            
            if (empty($theater_id)) {
                $_SESSION['errors'] = ["Theater ID is required"];
                header("Location: ../views/admin/theaters/index.php");
                exit();
            }
            
            // Delete theater
            if ($this->theaterModel->deleteTheater($theater_id)) {
                $_SESSION['success'] = "Theater deleted successfully!";
            } else {
                $_SESSION['errors'] = ["Failed to delete theater. Make sure it has no associated auditoriums."];
            }
            
            header("Location: ../views/admin/theaters/index.php");
            exit();
        }
    }
    
    public function getTheaters() {
        // API endpoint for frontend
        header('Content-Type: application/json');
        
        $theaters = $this->theaterModel->getAllTheaters();
        
        echo json_encode([
            'success' => true,
            'data' => $theaters
        ]);
    }
    
    public function getTheater($theater_id) {
        // API endpoint for frontend
        header('Content-Type: application/json');
        
        $theater = $this->theaterModel->getTheaterById($theater_id);
        
        if ($theater) {
            echo json_encode([
                'success' => true,
                'data' => $theater
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Theater not found'
            ]);
        }
    }
    
    public function getTheatersByCity($city) {
        // API endpoint for frontend
        header('Content-Type: application/json');
        
        $theaters = $this->theaterModel->getTheatersByCity($city);
        
        echo json_encode([
            'success' => true,
            'data' => $theaters
        ]);
    }
    
    public function getCities() {
        // API endpoint for frontend
        header('Content-Type: application/json');
        
        $cities = $this->theaterModel->getCities();
        
        echo json_encode([
            'success' => true,
            'data' => $cities
        ]);
    }
}

// Handle requests
if (isset($_GET['action'])) {
    $theaterController = new TheaterController();
    
    switch ($_GET['action']) {
        case 'create':
            $theaterController->create();
            break;
        case 'update':
            $theaterController->update();
            break;
        case 'delete':
            $theaterController->delete();
            break;
        case 'get_theaters':
            $theaterController->getTheaters();
            break;
        case 'get_theater':
            $theater_id = (int)$_GET['id'];
            $theaterController->getTheater($theater_id);
            break;
        case 'get_theaters_by_city':
            $city = sanitize_input($_GET['city']);
            $theaterController->getTheatersByCity($city);
            break;
        case 'get_cities':
            $theaterController->getCities();
            break;
        default:
            header("Location: ../views/admin/theaters/index.php");
            break;
    }
} else {
    header("Location: ../views/admin/theaters/index.php");
}
?>
