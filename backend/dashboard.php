<?php
// Load common config, sessions and helpers
require_once __DIR__ . '/config/connection.php';

// Ensure user is logged in
require_login();

// get user info from session
$user_id = $_SESSION['user_id'];
$user_name = htmlspecialchars($_SESSION['name']);
$role = $_SESSION['role'];
?>
<?php
// Include footer
include('includes/footer.php');
?>