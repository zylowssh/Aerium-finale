#!/bin/bash

echo "🚀 Starting Aerium Air Quality Monitoring Platform..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Start backend
echo "📦 Starting Flask backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Copying from .env.example..."
    cp .env.example .env
fi

pip install -r requirements.txt > /dev/null 2>&1

# Check if database needs seeding
if [ ! -f "aerium.db" ]; then
    echo "Seeding database with demo data..."
    python seed_database.py
fi

python app.py &
BACKEND_PID=$!
echo "✅ Backend started on http://localhost:5000 (PID: $BACKEND_PID)"

cd ..

# Start frontend
echo "📦 Starting React frontend..."

if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Copying from .env.example..."
    cp .env.example .env
fi

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started on http://localhost:8080 (PID: $FRONTEND_PID)"

echo ""
echo "✨ Aerium is now running!"
echo "   Frontend: http://localhost:8080"
echo "   Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services..."

# Trap Ctrl+C and kill both processes
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

wait
