@echo off
echo ===================================================
echo   Online Cinema & Management System Starter
echo ===================================================
echo.

echo [1/3] Checking XAMPP Apache & MySQL...
echo Ensure Apache and MySQL are running in your XAMPP Control Panel.
echo Backend API Endpoint: http://localhost/cine/backend/
echo.

echo [2/3] Checking Backend Connection...
curl -s http://localhost/cine/backend/controllers/theatercontroller.php?action=get_theaters > nul
if %errorlevel% neq 0 (
    echo [WARNING] Could not reach backend at http://localhost/cine/backend/.
    echo Please make sure Apache and MySQL are started in XAMPP.
) else (
    echo [SUCCESS] Backend API is responding!
)
echo.

echo [3/3] Starting Frontend React Application...
cd /d "%~dp0frontend"
npm start

pause
