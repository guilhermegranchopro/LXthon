#!/bin/bash
# Simple backend testing script

echo "🧪 Testing Backend Docker Setup"
echo "================================"

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

# Build backend image
echo "🏗️ Building backend Docker image..."
cd backend
docker build -t eye-vessel-backend .
cd ..

# Stop any existing container
echo "🛑 Stopping existing containers..."
docker stop eye-vessel-backend-dev 2>/dev/null || true
docker rm eye-vessel-backend-dev 2>/dev/null || true

# Start the backend container
echo "🚀 Starting backend container..."
docker run -d \
    --name eye-vessel-backend-dev \
    -p 8000:8000 \
    -v "$(pwd)/backend/models:/app/models" \
    eye-vessel-backend

# Wait for container to start
echo "⏳ Waiting for backend to be ready..."
sleep 10

# Check if container is running
if docker ps | grep -q eye-vessel-backend-dev; then
    echo "✅ Backend container is running!"
    
    # Test health endpoint
    echo "🔍 Testing health endpoint..."
    curl -f http://localhost:8000/health 2>/dev/null && echo -e "\n✅ Health check passed!" || echo "❌ Health check failed"
    
    echo ""
    echo "📋 Backend is ready!"
    echo "   API URL: http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"
    echo "   Health: http://localhost:8000/health"
    echo ""
    echo "🔧 Management commands:"
    echo "   View logs: docker logs eye-vessel-backend-dev"
    echo "   Stop: docker stop eye-vessel-backend-dev"
    echo "   Remove: docker rm eye-vessel-backend-dev"
else
    echo "❌ Backend container failed to start"
    echo "📋 Container logs:"
    docker logs eye-vessel-backend-dev
    exit 1
fi
