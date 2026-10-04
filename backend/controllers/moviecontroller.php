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

// Helper function to send JSON response
function sendResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

// Helper function to handle file upload
function handleFileUpload($file, $uploadDir = '../uploads/posters/') {
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowedTypes)) {
        return null;
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('movie_') . '.' . $extension;
    $targetPath = $uploadDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return 'uploads/posters/' . $filename;
    }
    
    return null;
}

// Get database connection
$database = new Database();
$conn = $database->getConnection();

// Get action from query parameter
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'get_movies':
            // Fetch from movies table
            $query = "SELECT * FROM movies WHERE status = 'active' ORDER BY movie_id DESC";
            $result = $conn->query($query);
            
            $movies = [];
            while ($row = $result->fetch_assoc()) {
                $movies[] = $row;
            }
            
            sendResponse(true, 'Movies retrieved successfully', $movies);
            break;
            
        case 'get_movie':
            $movie_id = intval($_GET['id'] ?? 0);
            
            if ($movie_id <= 0) {
                sendResponse(false, 'Invalid movie ID');
            }
            
            $stmt = $conn->prepare("SELECT * FROM movies WHERE movie_id = ? AND status = 'active'");
            $stmt->bind_param("i", $movie_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $movie = $result->fetch_assoc();
                sendResponse(true, 'Movie retrieved successfully', $movie);
            } else {
                sendResponse(false, 'Movie not found');
            }
            break;
            
        case 'create':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Invalid request method');
            }
            
            // Get form data
            $title = $_POST['title'] ?? '';
            $description = $_POST['description'] ?? '';
            $genre = $_POST['genre'] ?? '';
            $duration = intval($_POST['duration'] ?? 0);
            $language = $_POST['language'] ?? '';
            $release_date = $_POST['release_date'] ?? date('Y-m-d');
            $rating = floatval($_POST['rating'] ?? 0);
            $director = $_POST['director'] ?? '';
            $cast = $_POST['cast'] ?? '';
            
            // Validation
            if (empty($title)) {
                sendResponse(false, 'Movie title is required');
            }
            if (empty($genre)) {
                sendResponse(false, 'Genre is required');
            }
            if ($duration <= 0) {
                sendResponse(false, 'Duration must be greater than 0');
            }
            
            // Handle poster upload
            $poster_url = null;
            if (isset($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
                $poster_url = handleFileUpload($_FILES['poster']);
                if (!$poster_url) {
                    sendResponse(false, 'Failed to upload poster. Please use JPG, PNG, or GIF format.');
                }
            }
            
            // Insert into movies table
            $stmt = $conn->prepare("INSERT INTO movies (title, description, genre, duration, language, release_date, rating, director, cast, poster_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')");
            $stmt->bind_param("sssisdssss", $title, $description, $genre, $duration, $language, $release_date, $rating, $director, $cast, $poster_url);
            
            if ($stmt->execute()) {
                $movie_id = $stmt->insert_id;
                sendResponse(true, 'Movie added successfully! 🎬', [
                    'movie_id' => $movie_id,
                    'title' => $title,
                    'genre' => $genre
                ]);
            } else {
                sendResponse(false, 'Failed to add movie: ' . $stmt->error);
            }
            break;
            
        case 'update':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Invalid request method');
            }
            
            $movie_id = intval($_POST['movie_id'] ?? 0);
            
            if ($movie_id <= 0) {
                sendResponse(false, 'Invalid movie ID');
            }
            
            $title = $_POST['title'] ?? '';
            $description = $_POST['description'] ?? '';
            $genre = $_POST['genre'] ?? '';
            $duration = intval($_POST['duration'] ?? 0);
            $language = $_POST['language'] ?? '';
            $release_date = $_POST['release_date'] ?? date('Y-m-d');
            $rating = floatval($_POST['rating'] ?? 0);
            $director = $_POST['director'] ?? '';
            $cast = $_POST['cast'] ?? '';
            
            if (empty($title) || empty($genre) || $duration <= 0) {
                sendResponse(false, 'Title, genre, and duration are required');
            }
            
            if (isset($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
                $poster_url = handleFileUpload($_FILES['poster']);
                $stmt = $conn->prepare("UPDATE movies SET title = ?, description = ?, genre = ?, duration = ?, language = ?, release_date = ?, rating = ?, director = ?, cast = ?, poster_url = ? WHERE movie_id = ?");
                $stmt->bind_param("sssisdsssi", $title, $description, $genre, $duration, $language, $release_date, $rating, $director, $cast, $poster_url, $movie_id);
            } else {
                $stmt = $conn->prepare("UPDATE movies SET title = ?, description = ?, genre = ?, duration = ?, language = ?, release_date = ?, rating = ?, director = ?, cast = ? WHERE movie_id = ?");
                $stmt->bind_param("sssisdsssi", $title, $description, $genre, $duration, $language, $release_date, $rating, $director, $cast, $movie_id);
            }
            
            if ($stmt->execute()) {
                sendResponse(true, 'Movie updated successfully! ✅');
            } else {
                sendResponse(false, 'Failed to update movie: ' . $stmt->error);
            }
            break;
            
        case 'delete':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(false, 'Invalid request method');
            }
            
            $movie_id = intval($_POST['movie_id'] ?? 0);
            
            if ($movie_id <= 0) {
                sendResponse(false, 'Invalid movie ID');
            }
            
            $stmt = $conn->prepare("SELECT poster_url FROM movies WHERE movie_id = ?");
            $stmt->bind_param("i", $movie_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $movie = $result->fetch_assoc();
                $poster_url = $movie['poster_url'];
                
                $stmt = $conn->prepare("DELETE FROM movies WHERE movie_id = ?");
                $stmt->bind_param("i", $movie_id);
                
                if ($stmt->execute()) {
                    if ($poster_url && file_exists('../' . $poster_url)) {
                        unlink('../' . $poster_url);
                    }
                    sendResponse(true, 'Movie deleted successfully! 🗑️');
                } else {
                    sendResponse(false, 'Failed to delete movie: ' . $stmt->error);
                }
            } else {
                sendResponse(false, 'Movie not found');
            }
            break;
            
        default:
            sendResponse(false, 'Invalid action');
    }
} catch (Exception $e) {
    sendResponse(false, 'Server error: ' . $e->getMessage());
}

$database->closeConnection();
?>
