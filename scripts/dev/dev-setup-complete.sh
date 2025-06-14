#!/bin/zsh
# Complete development environment setup with uv and modern tooling

set -e

echo "🚀 Complete Development Environment Setup"
echo "========================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install uv if not available
if ! command_exists uv; then
    echo "📦 Installing uv..."
    pip install uv
fi

# Backend setup
echo ""
echo "🔧 Backend Setup (Python + uv + ruff)"
echo "-------------------------------------"
cd backend

# Setup virtual environment
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    uv venv
fi

echo "📥 Installing backend dependencies..."
source .venv/bin/activate
uv pip install -e ".[dev]"

echo "🔍 Running ruff linting..."
ruff check app/ --fix
ruff format app/

echo "✅ Backend setup complete!"

# Return to root directory
cd ..

# Frontend setup
echo ""
echo "🎨 Frontend Setup (Next.js)"
echo "---------------------------"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

echo "✅ Frontend setup complete!"

# Return to root directory
cd ..

echo ""
echo "🎉 Development environment ready!"
echo ""
echo "Available commands:"
echo "  Backend (from /backend):"
echo "    make dev-setup     # Full development setup"
echo "    make run           # Start development server"
echo "    make lint          # Run linting"
echo "    make test          # Run tests"
echo ""
echo "  Frontend (from /frontend):"
echo "    npm run dev        # Start development server (port 3001)"
echo "    npm run build      # Build for production"
echo ""
echo "  Quick start:"
echo "    ./start-backend-dev.sh    # Start backend (uv + hot reload)"
echo "    ./start-frontend.sh       # Start frontend (port 3001)"
echo ""
echo "Servers will run on:"
echo "  🔧 Backend API: http://localhost:8000"
echo "  🎨 Frontend:    http://localhost:3001"
