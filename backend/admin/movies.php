<?php
// Always return JSON
header("Content-Type: application/json");

// Allow CORS for local React frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Log errors for debugging, but don’t show raw errors to client
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Include DB connection safely
try {
    include("../config/connection.php");
    if (!$conn) {
        throw new Exception("Database connection failed");
    }
} catch (Exception $e) {
    error_log("DB Connection Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error: DB connection failed']);
    exit;
}

// Get HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// Helper: read JSON body safely
function getJsonBody() {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return [];
    }
    return $data;
}

// Wrap all operations in try/catch
try {
    switch ($method) {

        case "GET":
            $sql = "SELECT m.movie_id AS id, m.title, m.genre, m.duration, t.name AS theater_name, m.theater_id
                    FROM movies m
                    LEFT JOIN theaters t ON m.theater_id = t.theater_id";
            $result = $conn->query($sql);
            if ($result) {
                $movies = $result->fetch_all(MYSQLI_ASSOC);
                echo json_encode(['success' => true, 'movies' => $movies]);
            } else {
                throw new Exception("Failed to fetch movies: " . $conn->error);
            }
            break;

        case "POST":
            $data = getJsonBody();
            if (!isset($data['title'], $data['genre'], $data['duration'], $data['theater_id'])) {
                throw new Exception("Missing required fields");
            }
            $stmt = $conn->prepare("INSERT INTO movies (title, genre, duration, theater_id) VALUES (?, ?, ?, ?)");
            if (!$stmt) throw new Exception($conn->error);
            $stmt->bind_param("sssi", $data['title'], $data['genre'], $data['duration'], $data['theater_id']);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => "🎬 Movie added successfully"]);
            } else {
                throw new Exception($stmt->error);
            }
            break;

        case "PUT":
            $data = getJsonBody();
            if (!isset($data['id'], $data['title'], $data['genre'], $data['duration'], $data['theater_id'])) {
                throw new Exception("Missing required fields");
            }
            $stmt = $conn->prepare("UPDATE movies SET title=?, genre=?, duration=?, theater_id=? WHERE movie_id=?");
            if (!$stmt) throw new Exception($conn->error);
            $stmt->bind_param("sssii", $data['title'], $data['genre'], $data['duration'], $data['theater_id'], $data['id']);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => "✅ Movie updated successfully"]);
            } else {
                throw new Exception($stmt->error);
            }
            break;

        case "DELETE":
            $data = getJsonBody();
            if (!isset($data['id'])) {
                throw new Exception("Missing movie ID");
            }
            $stmt = $conn->prepare("DELETE FROM movies WHERE movie_id=?");
            if (!$stmt) throw new Exception($conn->error);
            $stmt->bind_param("i", $data['id']);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => "🗑️ Movie deleted successfully"]);
            } else {
                throw new Exception($stmt->error);
            }
            break;

        default:
            echo json_encode(['success' => false, 'message' => "Method not allowed"]);
            break;
    }
} catch (Exception $e) {
    // Log actual error on server, return generic message to client
    error_log("Movies API Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => "Server error: " . $e->getMessage()]);
}
