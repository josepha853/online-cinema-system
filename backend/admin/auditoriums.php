<?php
include('../config/connection.php');
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin') {
    header("Location: ../models/login.php");
    exit();
}

// Fetch theaters for dropdown
$theaters = $conn->query("SELECT theater_id, name FROM theaters");

// Add auditorium
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['add_auditorium'])) {
    $theater_id = intval($_POST['theater_id']);
    $name = htmlspecialchars($_POST['name']);
    $seating_map = htmlspecialchars($_POST['seating_map']);
    $capacity = intval($_POST['capacity']);

    $stmt = $conn->prepare("INSERT INTO auditoriums (theater_id, name, seating_map_url, capacity) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("issi", $theater_id, $name, $seating_map, $capacity);
    $stmt->execute();
    $stmt->close();
}

// Fetch auditoriums
$result = $conn->query("SELECT a.aud_id, a.name, a.seating_map_url, a.capacity, t.name AS theater_name
                        FROM auditoriums a
                        JOIN theaters t ON a.theater_id = t.theater_id");
?>

<h2>Auditoriums List</h2>

<form method="POST">
    <select name="theater_id" required>
        <option value="">Select Theater</option>
        <?php while($t = $theaters->fetch_assoc()): ?>
        <option value="<?= $t['theater_id'] ?>"><?= htmlspecialchars($t['name']) ?></option>
        <?php endwhile; ?>
    </select>
    <input type="text" name="name" placeholder="Auditorium Name" required>
    <input type="text" name="seating_map" placeholder="Seating Map URL">
    <input type="number" name="capacity" placeholder="Capacity" required>
    <button type="submit" name="add_auditorium">Add Auditorium</button>
</form>

<table border="1">
    <tr>
        <th>ID</th><th>Name</th><th>Theater</th><th>Seating Map</th><th>Capacity</th><th>Actions</th>
    </tr>
    <?php while($row = $result->fetch_assoc()): ?>
    <tr>
        <td><?= $row['aud_id'] ?></td>
        <td><?= htmlspecialchars($row['name']) ?></td>
        <td><?= htmlspecialchars($row['theater_name']) ?></td>
        <td><?= htmlspecialchars($row['seating_map_url']) ?></td>
        <td><?= $row['capacity'] ?></td>
        <td>
            <a href="edit_auditorium.php?id=<?= $row['aud_id'] ?>">Edit</a> |
            <a href="delete_auditorium.php?id=<?= $row['aud_id'] ?>" onclick="return confirm('Delete this auditorium?')">Delete</a>
        </td>
    </tr>
    <?php endwhile; ?>
</table>
