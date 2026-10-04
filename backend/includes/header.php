<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? $page_title : 'Cinema Booking System'; ?></title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="../assets/css/style.css" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="../assets/images/favicon.ico">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="../index.php">
                <i class="fas fa-film me-2"></i>
                <strong>CinemaHub</strong>
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <?php if (is_logged_in()): ?>
                        <?php if (get_user_role() === 'admin'): ?>
                            <li class="nav-item">
                                <a class="nav-link" href="../views/admin/dashboard.php">
                                    <i class="fas fa-tachometer-alt me-1"></i> Dashboard
                                </a>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="managementDropdown" role="button" data-bs-toggle="dropdown">
                                    <i class="fas fa-cogs me-1"></i> Management
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="../views/admin/theaters/index.php">Theaters</a></li>
                                    <li><a class="dropdown-item" href="../views/admin/auditoriums/index.php">Auditoriums</a></li>
                                    <li><a class="dropdown-item" href="../views/admin/shows/index.php">Shows</a></li>
                                    <li><a class="dropdown-item" href="../views/admin/ticket_types/index.php">Ticket Types</a></li>
                                    <li><a class="dropdown-item" href="../views/admin/bookings/index.php">Bookings</a></li>
                                    <li><a class="dropdown-item" href="../views/admin/users/index.php">Users</a></li>
                                </ul>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="reportsDropdown" role="button" data-bs-toggle="dropdown">
                                    <i class="fas fa-chart-bar me-1"></i> Reports
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="../views/admin/reports/revenue.php">Revenue Reports</a></li>
                                    <li><a class="dropdown-item" href="../views/admin/reports/occupancy.php">Occupancy Reports</a></li>
                                    <li><a class="dropdown-item" href="../views/admin/reports/feedback.php">Feedback Reports</a></li>
                                </ul>
                            </li>
                            <li class="nav-item d-flex align-items-center ms-3">
                                <a class="btn btn-sm btn-outline-light me-2" href="../controllers/ReportController.php?action=export_revenue&range=monthly">
                                    <i class="fas fa-file-csv"></i> CSV
                                </a>
                                <a class="btn btn-sm btn-outline-light" href="../controllers/ReportController.php?action=export_occupancy&range=monthly">
                                    <i class="fas fa-file-pdf"></i> PDF
                                </a>
                            </li>
                        <?php elseif (get_user_role() === 'staff'): ?>
                            <li class="nav-item">
                                <a class="nav-link" href="../views/staff/dashboard.php">
                                    <i class="fas fa-tachometer-alt me-1"></i> Dashboard
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="../views/staff/checkin.php">
                                    <i class="fas fa-ticket-alt me-1"></i> Check-in
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="../views/staff/bookings.php">
                                    <i class="fas fa-list me-1"></i> Today's Bookings
                                </a>
                            </li>
                        <?php else: ?>
                            <li class="nav-item">
                                <a class="nav-link" href="../views/customer/dashboard.php">
                                    <i class="fas fa-home me-1"></i> Home
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="../views/customer/shows.php">
                                    <i class="fas fa-film me-1"></i> Movies & Shows
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="../views/customer/bookings.php">
                                    <i class="fas fa-ticket-alt me-1"></i> My Bookings
                                </a>
                            </li>
                        <?php endif; ?>
                    <?php else: ?>
                        <li class="nav-item">
                            <a class="nav-link" href="../views/index.php">
                                <i class="fas fa-home me-1"></i> Home
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="../views/shows.php">
                                <i class="fas fa-film me-1"></i> Movies
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="../views/theaters.php">
                                <i class="fas fa-map-marker-alt me-1"></i> Theaters
                            </a>
                        </li>
                    <?php endif; ?>
                </ul>
                
                <ul class="navbar-nav">
                    <?php if (is_logged_in()): ?>
                        <!-- Notifications -->
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="notificationDropdown" role="button" data-bs-toggle="dropdown">
                                <i class="fas fa-bell"></i>
                                <span class="badge bg-danger" id="notificationCount">0</span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" id="notificationList" style="min-width: 300px; max-height: 400px; overflow-y: auto;">
                                <!-- Notifications will be loaded here -->
                            </ul>
                        </li>
                        
                        <!-- User Menu -->
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                                <i class="fas fa-user me-1"></i>
                                <?php echo $_SESSION['name']; ?>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <?php if (get_user_role() === 'customer'): ?>
                                    <li><a class="dropdown-item" href="../views/customer/profile.php">
                                        <i class="fas fa-user-circle me-2"></i> Profile
                                    </a></li>
                                    <li><a class="dropdown-item" href="../views/customer/wallet.php">
                                        <i class="fas fa-wallet me-2"></i> Wallet: RWF <?php echo number_format($_SESSION['wallet_balance'], 2); ?>
                                    </a></li>
                                    <li><a class="dropdown-item" href="../views/customer/loyalty.php">
                                        <i class="fas fa-star me-2"></i> Points: <?php echo $_SESSION['loyalty_points']; ?>
                                    </a></li>
                                    <li><hr class="dropdown-divider"></li>
                                <?php endif; ?>
                                <li><a class="dropdown-item" href="../controllers/AuthController.php?action=logout">
                                    <i class="fas fa-sign-out-alt me-2"></i> Logout
                                </a></li>
                            </ul>
                        </li>
                    <?php else: ?>
                        <li class="nav-item">
                            <a class="nav-link" href="../views/login.php">
                                <i class="fas fa-sign-in-alt me-1"></i> Login
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="../views/register.php">
                                <i class="fas fa-user-plus me-1"></i> Register
                            </a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Flash Messages -->
    <?php if (isset($_SESSION['success'])): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>
            <?php echo $_SESSION['success']; unset($_SESSION['success']); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <?php if (isset($_SESSION['errors'])): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i>
            <?php 
            if (is_array($_SESSION['errors'])) {
                echo '<ul class="mb-0">';
                foreach ($_SESSION['errors'] as $error) {
                    echo '<li>' . $error . '</li>';
                }
                echo '</ul>';
            } else {
                echo $_SESSION['errors'];
            }
            unset($_SESSION['errors']); 
            ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <!-- Main Content -->
    <main class="container-fluid py-4">
        <?php if (isset($page_heading)): ?>
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="h3 mb-0"><?php echo $page_heading; ?></h1>
                    <?php if (isset($page_description)): ?>
                        <p class="text-muted mb-0"><?php echo $page_description; ?></p>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>

        
