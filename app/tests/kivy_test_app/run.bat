@echo off
REM Aerium Kivy Test App Launcher
REM This script installs dependencies and runs the Kivy test app

echo.
echo ========================================
echo  Aerium Kivy Test App Launcher
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Install/upgrade dependencies
echo Installing dependencies...
pip install -q -r requirements.txt

if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo Launching Aerium Kivy Test App...
echo.
echo Note: Make sure the Flask webapp is running on http://localhost:5000
echo.

REM Run the app
python kivy_app.py

pause
