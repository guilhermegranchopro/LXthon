#!/bin/bash

# UV Setup Script for Eye Vessel Segmentation Backend
# This script sets up the development environment using uv

set -e  # Exit on any error

echo "🚀 Setting up development environment with uv..."

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ uv is not installed. Installing uv..."
    pip install uv
fi

echo "✅ uv version: $(uv --version)"

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    uv venv
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment and install dependencies
echo "📥 Installing dependencies..."
source .venv/bin/activate
uv pip install -e ".[dev]"

echo "🎉 Setup complete!"
echo ""
echo "To activate the environment, run:"
echo "  source .venv/bin/activate"
echo ""
echo "Available commands:"
echo "  ruff check app/           # Check code quality"
echo "  ruff format app/          # Format code"
echo "  pytest                    # Run tests"
echo "  uvicorn app.main:app --reload  # Start development server"
