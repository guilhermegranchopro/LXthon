#!/bin/bash
# Development setup script for Eye Vessel Segmentation project

echo "🚀 Eye Vessel Segmentation - Development Setup"
echo "================================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
print_status "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running"
    exit 1
fi

print_success "Docker is available and running"

# Check if model file exists
MODEL_PATH="backend/models/unet_eye_segmentation.keras"
if [ -f "$MODEL_PATH" ]; then
    MODEL_SIZE=$(du -h "$MODEL_PATH" | cut -f1)
    print_success "Model file found: $MODEL_SIZE"
else
    print_warning "Model file not found at $MODEL_PATH"
    print_warning "The application will use a dummy model for testing"
fi

# Build the backend Docker image
print_status "Building backend Docker image..."
if docker build -t eye-vessel-backend ./backend; then
    print_success "Backend image built successfully"
else
    print_error "Failed to build backend image"
    exit 1
fi

# Start the backend container
print_status "Starting backend container..."
docker stop eye-vessel-backend-dev 2>/dev/null || true
docker rm eye-vessel-backend-dev 2>/dev/null || true

if docker run -d \
    --name eye-vessel-backend-dev \
    -p 8000:8000 \
    -v "$(pwd)/backend/models:/app/models" \
    eye-vessel-backend; then
    print_success "Backend container started on port 8000"
else
    print_error "Failed to start backend container"
    exit 1
fi

# Wait for backend to be ready
print_status "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -f http://localhost:8000/health &> /dev/null; then
        print_success "Backend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start within 30 seconds"
        docker logs eye-vessel-backend-dev
        exit 1
    fi
    sleep 1
done

# Test the backend
print_status "Testing backend health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:8000/health)
echo "Health response: $HEALTH_RESPONSE"

# Check if frontend dependencies are installed
print_status "Checking frontend setup..."
cd frontend

if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

# Start the frontend in development mode
print_status "Starting frontend development server..."
print_success "Setup complete! 🎉"
echo ""
echo "📋 Development Environment:"
echo "   Backend API: http://localhost:8000"
echo "   API Docs:    http://localhost:8000/docs"
echo "   Frontend:    http://localhost:3000 (starting...)"
echo ""
echo "🔧 Useful commands:"
echo "   Stop backend:     docker stop eye-vessel-backend-dev"
echo "   View logs:        docker logs eye-vessel-backend-dev"
echo "   Restart backend:  docker restart eye-vessel-backend-dev"
echo ""

# Start frontend
npm run dev
