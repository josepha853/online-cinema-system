<?php
require_once 'config/connection.php';

$db = new Database();
$conn = $db->getConnection();

$result = $conn->query("SELECT COUNT(*) as count FROM theaters");
$row = $result->fetch_assoc();

echo "Number of theaters in database: " . $row['count'] . "\n\n";

if ($row['count'] > 0) {
    $theaters = $conn->query("SELECT * FROM theaters");
    echo "Theaters:\n";
    while ($theater = $theaters->fetch_assoc()) {
        echo "- ID: " . $theater['theater_id'] . ", Name: " . $theater['name'] . ", City: " . $theater['city'] . "\n";
    }
} else {
    echo "No theaters found. You may need to add some theaters to the database.\n";
}

$db->closeConnection();
?>
