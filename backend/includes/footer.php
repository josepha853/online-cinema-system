</main>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5><i class="fas fa-film me-2"></i>CinemaHub</h5>
                    <p class="text-muted">Your premier destination for cinema ticket booking and entertainment management in Rwanda.</p>
                    <div class="d-flex gap-3">
                        <a href="#" class="text-light"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="text-light"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="text-light"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="text-light"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                
                <div class="col-md-2">
                    <h6>Quick Links</h6>
                    <ul class="list-unstyled">
                        <li><a href="../views/index.php" class="text-muted text-decoration-none">Home</a></li>
                        <li><a href="../views/shows.php" class="text-muted text-decoration-none">Movies</a></li>
                        <li><a href="../views/theaters.php" class="text-muted text-decoration-none">Theaters</a></li>
                        <li><a href="../views/contact.php" class="text-muted text-decoration-none">Contact</a></li>
                    </ul>
                </div>
                
                <div class="col-md-3">
                    <h6>Services</h6>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-muted text-decoration-none">Online Booking</a></li>
                        <li><a href="#" class="text-muted text-decoration-none">Group Bookings</a></li>
                        <li><a href="#" class="text-muted text-decoration-none">Gift Cards</a></li>
                        <li><a href="#" class="text-muted text-decoration-none">Loyalty Program</a></li>
                    </ul>
                </div>
                
                <div class="col-md-3">
                    <h6>Contact Info</h6>
                    <ul class="list-unstyled text-muted">
                        <li><i class="fas fa-map-marker-alt me-2"></i> KN 4 Ave, Kigali, Rwanda</li>
                        <li><i class="fas fa-phone me-2"></i> +250 788 123 456</li>
                        <li><i class="fas fa-envelope me-2"></i> info@cinemahub.rw</li>
                        <li><i class="fas fa-clock me-2"></i> Mon-Sun: 9AM-11PM</li>
                    </ul>
                </div>
            </div>
            
            <hr class="border-secondary my-4">
            
            <div class="row align-items-center">
                <div class="col-md-6">
                    <p class="mb-0 text-muted">&copy; <?php echo date('Y'); ?> CinemaHub. All rights reserved.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <a href="#" class="text-muted text-decoration-none me-3">Privacy Policy</a>
                    <a href="#" class="text-muted text-decoration-none me-3">Terms of Service</a>
                    <a href="#" class="text-muted text-decoration-none">Refund Policy</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <!-- Custom JS -->
    <script src="../assets/js/main.js"></script>
    
    <!-- Notification System -->
    <?php if (is_logged_in()): ?>
    <script>
        // Load notifications
        function loadNotifications() {
            $.ajax({
                url: '../controllers/NotificationController.php?action=get_notifications',
                method: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        $('#notificationCount').text(response.unread_count);
                        
                        let notificationHtml = '';
                        if (response.data.length === 0) {
                            notificationHtml = '<li><span class="dropdown-item text-muted">No notifications</span></li>';
                        } else {
                            response.data.forEach(function(notification) {
                                let iconClass = notification.type === 'success' ? 'fa-check-circle text-success' :
                                               notification.type === 'warning' ? 'fa-exclamation-triangle text-warning' :
                                               notification.type === 'error' ? 'fa-times-circle text-danger' :
                                               'fa-info-circle text-info';
                                
                                notificationHtml += `
                                    <li class="dropdown-item">
                                        <div class="d-flex align-items-start">
                                            <i class="fas ${iconClass} me-2 mt-1"></i>
                                            <div class="flex-grow-1">
                                                <small class="text-muted">${notification.sent_at}</small>
                                                <p class="mb-0">${notification.message}</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li><hr class="dropdown-divider"></li>
                                `;
                            });
                        }
                        
                        $('#notificationList').html(notificationHtml);
                    }
                },
                error: function() {
                    console.log('Failed to load notifications');
                }
            });
        }
        
        // Load notifications on page load
        $(document).ready(function() {
            loadNotifications();
            
            // Refresh notifications every 30 seconds
            setInterval(loadNotifications, 30000);
        });
    </script>
    <?php endif; ?>
    
    <!-- Form Validation -->
    <script>
        // Generic form validation
        (function() {
            'use strict';
            
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.querySelectorAll('.needs-validation');
            
            // Loop over them and prevent submission
            Array.prototype.slice.call(forms).forEach(function(form) {
                form.addEventListener('submit', function(event) {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        })();
        
        // Password strength checker
        function checkPasswordStrength(password) {
            let strength = 0;
            
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]+/)) strength++;
            if (password.match(/[A-Z]+/)) strength++;
            if (password.match(/[0-9]+/)) strength++;
            if (password.match(/[$@#&!]+/)) strength++;
            
            return strength;
        }
        
        // Show password strength
        $('#password, #new_password').on('input', function() {
            let password = $(this).val();
            let strength = checkPasswordStrength(password);
            
            let strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
            let strengthClass = ['danger', 'warning', 'info', 'primary', 'success'];
            
            if (password.length > 0) {
                $('#password-strength').removeClass().addClass('text-' + strengthClass[strength - 1]);
                $('#password-strength').text(strengthText[strength - 1]);
            } else {
                $('#password-strength').text('');
            }
        });
        
        // Confirm password validation
        $('#confirm_password, #confirm_new_password').on('input', function() {
            let password = $('#password, #new_password').val();
            let confirmPassword = $(this).val();
            
            if (password !== confirmPassword) {
                $(this).addClass('is-invalid');
                $(this).siblings('.invalid-feedback').show();
            } else {
                $(this).removeClass('is-invalid');
                $(this).siblings('.invalid-feedback').hide();
            }
        });
    </script>
    
    <!-- Loading States -->
    <script>
        // Show loading state on form submission
        $('form').on('submit', function() {
            let submitBtn = $(this).find('button[type="submit"]');
            let originalText = submitBtn.html();
            
            submitBtn.prop('disabled', true)
                     .html('<i class="fas fa-spinner fa-spin me-2"></i>Loading...');
            
            // Re-enable after 10 seconds (fallback)
            setTimeout(function() {
                submitBtn.prop('disabled', false).html(originalText);
            }, 10000);
        });
        
        // AJAX loading states
        $(document).ajaxStart(function() {
            $('body').addClass('loading');
        });
        
        $(document).ajaxStop(function() {
            $('body').removeClass('loading');
        });
    </script>
    
    <!-- Tooltips -->
    <script>
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    </script>
</body>
</html>
