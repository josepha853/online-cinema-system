@echo off
echo ========================================
echo CINEMA PROJECT - Backend Test
echo ========================================
echo.

REM Test 1: Check if Apache is running
echo [1/5] Testing if Apache is running...
curl -s http://localhost/ >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Apache is running!
) else (
    echo [ERROR] Apache is NOT running!
    echo Please start Apache in XAMPP Control Panel
    pause
    exit /b 1
)
echo.

REM Test 2: Check if project directory exists in htdocs
echo [2/5] Checking project location...
if exist "C:\xampp\htdocs\cine\" (
    echo [OK] Project found in htdocs
) else (
    echo [ERROR] Project NOT in htdocs!
    echo Current location: Desktop
    echo Required location: C:\xampp\htdocs\cine\
    echo.
    echo Do you want to copy the project to htdocs? (Y/N)
    set /p choice=
    if /i "%choice%"=="Y" (
        echo Copying project...
        xcopy /E /I /Y "%USERPROFILE%\OneDrive\Desktop\cine" "C:\xampp\htdocs\cine\"
        echo [OK] Project copied successfully!
    ) else (
        echo Please manually copy the project to C:\xampp\htdocs\cine\
        pause
        exit /b 1
    )
)
echo.

REM Test 3: Test backend API
echo [3/5] Testing backend API...
curl -s http://localhost/cine/backend/controllers/test.php
if %errorlevel% equ 0 (
    echo.
    echo [OK] Backend is reachable!
) else (
    echo [ERROR] Backend is NOT reachable!
    pause
    exit /b 1
)
echo.

REM Test 4: Test movie controller
echo [4/5] Testing movie controller...
curl -s "http://localhost/cine/backend/controllers/moviecontroller.php?action=get_movies"
if %errorlevel% equ 0 (
    echo.
    echo [OK] Movie controller is working!
) else (
    echo [ERROR] Movie controller failed!
)
echo.

REM Test 5: Check MySQL
echo [5/5] Checking MySQL...
curl -s http://localhost/phpmyadmin/ >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MySQL/phpMyAdmin is accessible
) else (
    echo [ERROR] MySQL might not be running
)
echo.

echo ========================================
echo All tests completed!
echo ========================================
echo.
echo Next steps:
echo 1. If all tests passed, refresh your admin page
echo 2. If any test failed, follow the instructions above
echo.
pause
