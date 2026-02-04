@echo off
echo 🚀 Starting Aerium Air Quality Monitoring Platform...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.9 or higher.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    exit /b 1
)

REM Start backend
echo 📦 Starting Flask backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

if not exist ".env" (
    echo ⚠️  No .env file found. Copying from .env.example...
    copy .env.example .env
)

pip install -r requirements.txt >nul 2>&1

REM Check if database needs seeding
if not exist "aerium.db" (
    echo Seeding database with demo data...
    python seed_database.py
)

start /B python app.py
echo ✅ Backend started on http://localhost:5000

cd ..

REM Start frontend
echo 📦 Starting React frontend...

if not exist ".env" (
    echo ⚠️  No .env file found. Copying from .env.example...
    copy .env.example .env
)

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

start /B npm run dev
echo ✅ Frontend started on http://localhost:8080

echo.
echo ✨ Aerium is now running!
echo    Frontend: http://localhost:8080
echo    Backend API: http://localhost:5000
echo.
echo Press Ctrl+C to stop all services...
echo.

pause
