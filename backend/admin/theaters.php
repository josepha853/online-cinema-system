<?php
session_start();
include('../config/connection.php');

// ✅ Reba niba user yarinjiye (login)
if (!isset($_SESSION['user_id'])) {
    echo "Access denied. Please <a href='../login.php'>login</a>.";
    exit();
}

// ✅ Reba niba role ari admin
if ($_SESSION['role'] !== 'admin') {
    echo "Access denied. Login as admin";
    exit();
}

// ✅ Niba byose ari byo, wereke dashboard y’admin
echo "<h2>🎬 Welcome Admin: " . htmlspecialchars($_SESSION['user_name']) . "</h2>";
echo "<p>You can now manage theaters here.</p>";

// Sample code yo kwerekana theaters muri DB
$query = "SELECT * FROM theaters";
$result = $conn->query($query);

if ($result && $result->num_rows > 0) {
    echo "<table border='1' cellpadding='8'>
            <tr><th>ID</th><th>Name</th><th>Location</th><th>Seats</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>{$row['theater_id']}</td>
                <td>{$row['name']}</td>
                <td>{$row['location']}</td>
                <td>{$row['seat_capacity']}</td>
              </tr>";
    }
    echo "</table>";
} else {
    echo "No theaters found.";
}

$conn->close();
?>
<?php include('../includes/footer.php'); ?>
