        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Content-Type: application/json');

        // Handle preflight
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        $this->showModel = new Show();
    }
    
    public function create() {
        require_admin();
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auditorium_id = (int)$_POST['auditorium_id'];
            $title = sanitize_input($_POST['title']);
            $type = sanitize_input($_POST['type']);
            $language = sanitize_input($_POST['language']);
            $genre = sanitize_input($_POST['genre']);
            $date = sanitize_input($_POST['date']);
            $time = sanitize_input($_POST['time']);
            $duration = sanitize_input($_POST['duration']);
            
            // Handle poster upload
            $poster_url = null;
            if (isset($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
                $poster_url = $this->handleFileUpload($_FILES['poster'], 'posters');
            }
            
            // Validation
            $errors = [];
            
            if (empty($auditorium_id)) $errors[] = "Auditorium is required";
            if (empty($title)) $errors[] = "Title is required";
            if (empty($type)) $errors[] = "Type is required";
            if (empty($language)) $errors[] = "Language is required";
            if (empty($genre)) $errors[] = "Genre is required";
            if (empty($date)) $errors[] = "Date is required";
            if (empty($time)) $errors[] = "Time is required";
            if (empty($duration)) $errors[] = "Duration is required";
            
            if (!empty($errors)) {
                $_SESSION['errors'] = $errors;
                $_SESSION['old_input'] = $_POST;
                header("Location: ../views/admin/shows/create.php");
                exit();
            }
            
            // Create show
            $show_id = $this->showModel->createShow($auditorium_id, $title, $type, $language, $genre, $date, $time, $duration, $poster_url);
            
            if ($show_id) {
                $_SESSION['success'] = "Show created successfully!";
                header("Location: ../views/admin/shows/index.php");
                exit();
            } else {
                $_SESSION['errors'] = ["Failed to create show. Please try again."];
                $_SESSION['old_input'] = $_POST;
                header("Location: ../views/admin/shows/create.php");
                exit();
            }
        }
    }
    
    public function update() {
        require_admin();
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $show_id = (int)$_POST['show_id'];
            $auditorium_id = (int)$_POST['auditorium_id'];
            $title = sanitize_input($_POST['title']);
            $type = sanitize_input($_POST['type']);
            $language = sanitize_input($_POST['language']);
            $genre = sanitize_input($_POST['genre']);
            $date = sanitize_input($_POST['date']);
            $time = sanitize_input($_POST['time']);
            $duration = sanitize_input($_POST['duration']);
            $status = sanitize_input($_POST['status']);
            
            // Handle poster upload
            $poster_url = $_POST['existing_poster'] ?? null;
            if (isset($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
                $poster_url = $this->handleFileUpload($_FILES['poster'], 'posters');
            }
            
            // Validation
            $errors = [];
            
            if (empty($show_id)) $errors[] = "Show ID is required";
            if (empty($auditorium_id)) $errors[] = "Auditorium is required";
            if (empty($title)) $errors[] = "Title is required";
            if (empty($type)) $errors[] = "Type is required";
            if (empty($language)) $errors[] = "Language is required";
            if (empty($genre)) $errors[] = "Genre is required";
            if (empty($date)) $errors[] = "Date is required";
            if (empty($time)) $errors[] = "Time is required";
            if (empty($duration)) $errors[] = "Duration is required";
            if (empty($status)) $errors[] = "Status is required";
            
            if (!empty($errors)) {
                $_SESSION['errors'] = $errors;
                $_SESSION['old_input'] = $_POST;
                header("Location: ../views/admin/shows/edit.php?id=$show_id");
                exit();
            }
            
            // Update show
            if ($this->showModel->updateShow($show_id, $auditorium_id, $title, $type, $language, $genre, $date, $time, $duration, $status, $poster_url)) {
                $_SESSION['success'] = "Show updated successfully!";
                header("Location: ../views/admin/shows/index.php");
                exit();
            } else {
                $_SESSION['errors'] = ["Failed to update show. Please try again."];
                $_SESSION['old_input'] = $_POST;
                header("Location: ../views/admin/shows/edit.php?id=$show_id");
                exit();
            }
        }
    }
    
    public function delete() {
        require_admin();
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $show_id = (int)$_POST['show_id'];
            
            if (empty($show_id)) {
                $_SESSION['errors'] = ["Show ID is required"];
                header("Location: ../views/admin/shows/index.php");
                exit();
            }
            
            // Delete show
            if ($this->showModel->deleteShow($show_id)) {
                $_SESSION['success'] = "Show deleted successfully!";
            } else {
                $_SESSION['errors'] = ["Failed to delete show. Make sure it has no associated ticket types."];
            }
            
            header("Location: ../views/admin/shows/index.php");
            exit();
        }
    }
    
    public function getShows() {
        // API endpoint for frontend
        header('Content-Type: application/json');
        
        $shows = $this->showModel->getAllShows();
        
        echo json_encode([
            'success' => true,
            'data' => $shows
        ]);
    }
    
    public function getShow($show_id) {
        // API endpoint for frontend
        header('Content-Type: application/json');
        
        $show = $this->showModel->getShowById($show_id);
        
        if ($show) {
            echo json_encode([
                'success' => true,
                'data' => $show
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Show not found'
            ]);
        }
    }
    
    public function getShowsByDate($date) {
        // API endpoint for frontend
        header('Content-Type: application/json');
        
        $shows = $this->showModel->getShowsByDate($date);
        
        echo json_encode([
            'success' => true,
            'data' => $shows
        ]);
    }
    
    public function getShowsByTheater($theater_id) {
        // API endpoint for frontend
        header('Content-Type: application/json');
        
        $shows = $this->showModel->getShowsByTheater($theater_id);
        
        echo json_encode([
            'success' => true,
            'data' => $shows
        ]);
    }
    
    public function searchShows() {
        // API endpoint for frontend
        header('Content-Type: application/json');
        
        $search_term = sanitize_input($_GET['search'] ?? '');
        $city = sanitize_input($_GET['city'] ?? '');
        $date = sanitize_input($_GET['date'] ?? '');
        
        $shows = $this->showModel->searchShows($search_term, $city ?: null, $date ?: null);
        
        echo json_encode([
            'success' => true,
            'data' => $shows
        ]);
    }
    
    public function getUpcomingShows() {
        // API endpoint for frontend
        header('Content-Type: application/json');
        
        $shows = $this->showModel->getUpcomingShows();
        
        echo json_encode([
            'success' => true,
            'data' => $shows
        ]);
    }
    
    private function handleFileUpload($file, $folder) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $max_size = 2 * 1024 * 1024; // 2MB
        
        // Validate file type
        if (!in_array($file['type'], $allowed_types)) {
            $_SESSION['errors'][] = "Invalid file type. Only JPEG, PNG, and GIF are allowed.";
            return null;
        }
        
        // Validate file size
        if ($file['size'] > $max_size) {
            $_SESSION['errors'][] = "File size too large. Maximum size is 2MB.";
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
}

// Handle requests
if (isset($_GET['action'])) {
    $showController = new ShowController();
    
    switch ($_GET['action']) {
        case 'create':
            $showController->create();
            break;
        case 'update':
            $showController->update();
            break;
        case 'delete':
            $showController->delete();
            break;
        case 'get_shows':
            $showController->getShows();
            break;
        case 'get_show':
            $show_id = (int)$_GET['id'];
            $showController->getShow($show_id);
            break;
        case 'get_shows_by_date':
            $date = sanitize_input($_GET['date']);
            $showController->getShowsByDate($date);
            break;
        case 'get_shows_by_theater':
            $theater_id = (int)$_GET['theater_id'];
            $showController->getShowsByTheater($theater_id);
            break;
        case 'search_shows':
            $showController->searchShows();
            break;
        case 'get_upcoming_shows':
            $showController->getUpcomingShows();
            break;
        default:
            header("Location: ../views/admin/shows/index.php");
            break;
    }
} else {
    header("Location: ../views/admin/shows/index.php");
}
?>
