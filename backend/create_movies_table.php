<?php
require_once 'config/connection.php';

$db = new Database();
$conn = $db->getConnection();

$sql = "CREATE TABLE IF NOT EXISTS movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    duration INT,
    language VARCHAR(50),
    release_date DATE,
    rating DECIMAL(3,1),
    director VARCHAR(150),
    cast TEXT,
    poster_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table movies created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$db->closeConnection();
?>
