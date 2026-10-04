<?php
session_start();

// If already logged in, send to dashboard
if (isset($_SESSION['user_id'])) {
    header("Location: ../dashboard.php");
    exit();
}

// include DB connection
include(__DIR__ . '/../config/connection.php');

// Get DB connection
$database = new Database();
$conn = $database->getConnection();

$error = "";

// Only process when form submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // sanitize inputs
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $error = "Please enter both email and password.";
    } else {
        // Prepare statement
        if ($stmt = $conn->prepare("SELECT user_id, name, password, role FROM users WHERE email = ? LIMIT 1")) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result && $result->num_rows === 1) {
                $user = $result->fetch_assoc();

                // Verify password
                if (password_verify($password, $user['password'])) {
                    // Set session variables
                    $_SESSION['user_id'] = $user['user_id'];
                    $_SESSION['user_name'] = $user['name'];
                    // also set legacy/session key used elsewhere
                    $_SESSION['name'] = $user['name'];
                    $_SESSION['role'] = $user['role'];

                    // Close stmt & conn then redirect to dashboard
                    $stmt->close();
                    $database->closeConnection();

                    header("Location: ../dashboard.php");
                    exit();
                } else {
                    $error = "Incorrect password.";
                }
            } else {
                $error = "No account found with that email.";
            }

            $stmt->close();
        } else {
            $error = "Database error: failed to prepare statement.";
        }
    }
}
?>
