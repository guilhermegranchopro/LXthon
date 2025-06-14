#!/bin/zsh
# Enhanced backend development script with uv support

set -e

echo "🧪 Enhanced Backend Development Setup"
echo "===================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if uv is available
if ! command_exists uv; then
    echo "❌ uv not found. Installing uv..."
    pip install uv
fi

echo "✅ uv version: $(uv --version)"

# Navigate to backend directory
cd backend

echo "🔧 Setting up development environment..."

# Setup virtual environment and dependencies
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment with uv..."
    uv venv
fi

echo "📥 Installing dependencies..."
source .venv/bin/activate
uv pip install -e ".[dev]"

echo "🔍 Running code quality checks..."
ruff check app/ --fix
ruff format app/

echo "🚀 Starting development server..."
echo "Backend will be available at: http://localhost:8000"
echo "API docs available at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
