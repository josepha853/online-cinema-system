# Cinema Booking Backend — Setup & Usage

This folder contains the PHP backend (no frameworks) for the Cinema Booking & Management System.

Prerequisites
- PHP 7.4+ with MySQLi support
- MySQL / MariaDB server
- Composer (optional, not required for this repo)

Quick setup
1. Create the database and import sample data:

```powershell
# From Windows PowerShell, change to the backend/database folder
cd .\backend\database
# Create the database and import the dump
mysql -u root -p < dump.sql
```

2. Update DB credentials in `config/connection.php` to match your MySQL server (host, username, password, database).

3. Start a local PHP server (for development):

```powershell
cd .\backend
# Serve on http://localhost:8000
php -S localhost:8000
```

4. Frontend (React) expects backend API endpoints under `http://localhost:8000/controllers/*`. Adjust `frontend/src/services/apiService.js` base URL if needed.

Notes & fixes applied
- Added `database/dump.sql` — schema and sample data.
- Fixed `models/login.php` to use the `Database` class and set both `name` and `user_name` session keys for compatibility with other views.
- Fixed `models/User.php` to include the `password` field in `getUserById` so profile/password updates can verify the current password.
- Fixed `dashboard.php` to use `require_login()` and correct session key.

Security / Production
- Disable display of errors in production: set `ini_set('display_errors', 0)` and `error_reporting(0)` in `config/connection.php`.
- Always use strong DB credentials and change sample passwords.

Next steps you may want me to do
- Implement CSV/PDF exports and report endpoints.
- Add a script to create an admin user with a hashed password.
- Run a basic smoke test script to exercise login and booking flows.
