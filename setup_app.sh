#!/bin/bash
echo "🚀 Eye Vessel Segmentation Application Setup"
echo "=============================================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo "📦 Checking dependencies..."

if ! command_exists python3; then
    echo "❌ Python3 not found"
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js not found"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm not found"
    exit 1
fi

echo "✅ All dependencies found"

# Set up backend
echo "🔧 Setting up backend..."
cd /home/guilhermegrancho/LXthon/backend

# Install Python dependencies
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt >/dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Set up frontend
echo "🔧 Setting up frontend..."
cd /home/guilhermegrancho/LXthon/frontend

# Install Node.js dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install >/dev/null 2>&1
fi

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Check if model exists
echo "🧠 Checking model..."
if [ -f "/home/guilhermegrancho/LXthon/backend/models/unet_eye_segmentation.keras" ]; then
    echo "✅ Model file found"
else
    echo "❌ Model file not found"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the application:"
echo "1. Backend: cd /home/guilhermegrancho/LXthon/backend && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000"
echo "2. Frontend: cd /home/guilhermegrancho/LXthon/frontend && npm run dev"
echo ""
echo "Access points:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"
echo "- API Documentation: http://localhost:8000/docs"
