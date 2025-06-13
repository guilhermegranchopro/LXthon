#!/bin/bash

# Eye Vessel Segmentation - Development Setup Script
# This script sets up the development environment for the hackathon project

set -e

echo "🚀 Setting up Eye Vessel Segmentation Hackathon Project"
echo "=================================================="

# Colors for output
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

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check Node.js (optional for local development)
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_warning "Node.js not found. You can still use Docker for development."
    fi
    
    # Check Python (optional for local development)
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python found: $PYTHON_VERSION"
    else
        print_warning "Python not found. You can still use Docker for development."
    fi
    
    print_success "System requirements check completed!"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Create virtual environment if Python is available
    if command -v python3 &> /dev/null; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
        source venv/bin/activate
        
        print_status "Installing Python dependencies..."
        pip install --upgrade pip
        pip install -r requirements.txt
        
        print_success "Backend Python environment setup completed!"
    else
        print_warning "Skipping Python virtual environment setup (Python not found)"
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install Node.js dependencies if Node is available
    if command -v npm &> /dev/null; then
        print_status "Installing Node.js dependencies..."
        npm install
        print_success "Frontend Node.js dependencies installed!"
    else
        print_warning "Skipping npm install (Node.js not found)"
    fi
    
    cd ..
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    # Ensure model directory exists
    mkdir -p backend/models
    mkdir -p frontend/public/samples
    mkdir -p logs
    
    print_success "Directories created!"
}

# Setup Docker environment
setup_docker() {
    print_status "Setting up Docker environment..."
    
    # Build Docker images
    print_status "Building Docker images (this may take a few minutes)..."
    docker-compose build
    
    print_success "Docker images built successfully!"
}

# Create sample environment files
create_env_files() {
    print_status "Creating environment configuration files..."
    
    # Backend .env
    if [ ! -f backend/.env ]; then
        cat > backend/.env << EOL
# Backend Environment Variables
PYTHONPATH=/app
LOG_LEVEL=INFO
MODEL_PATH=/app/models/unet_eye_segmentation.keras
MAX_UPLOAD_SIZE=10485760
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]
EOL
        print_success "Backend .env file created"
    fi
    
    # Frontend .env.local
    if [ ! -f frontend/.env.local ]; then
        cat > frontend/.env.local << EOL
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME="Eye Vessel Segmentation"
NEXT_PUBLIC_APP_VERSION="1.0.0"
EOL
        print_success "Frontend .env.local file created"
    fi
}

# Display usage instructions
show_usage() {
    echo ""
    print_success "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "=============="
    echo ""
    echo "1. Add your trained U-Net model:"
    echo "   cp /path/to/your/model.keras backend/models/unet_eye_segmentation.keras"
    echo ""
    echo "2. Start the development environment:"
    echo "   docker-compose up"
    echo ""
    echo "3. Access the application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"
    echo ""
    echo "🔧 Development Commands:"
    echo "======================="
    echo ""
    echo "Start services:"
    echo "  docker-compose up                 # Start all services"
    echo "  docker-compose up backend         # Start only backend"
    echo "  docker-compose up frontend        # Start only frontend"
    echo ""
    echo "Development mode:"
    echo "  docker-compose up --build         # Rebuild and start"
    echo "  docker-compose logs -f backend    # View backend logs"
    echo "  docker-compose logs -f frontend   # View frontend logs"
    echo ""
    echo "Stop services:"
    echo "  docker-compose down               # Stop all services"
    echo "  docker-compose down -v            # Stop and remove volumes"
    echo ""
    echo "🐛 Troubleshooting:"
    echo "=================="
    echo ""
    echo "Health check: curl http://localhost:8000/health"
    echo "View logs: docker-compose logs"
    echo "Reset: docker-compose down -v && docker-compose up --build"
    echo ""
    echo "📚 Documentation:"
    echo "================"
    echo ""
    echo "See README.md for detailed documentation"
    echo "API documentation: http://localhost:8000/docs"
    echo ""
    print_success "Happy coding! 🚀"
}

# Main setup flow
main() {
    check_requirements
    create_directories
    create_env_files
    setup_backend
    setup_frontend
    setup_docker
    show_usage
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Eye Vessel Segmentation - Development Setup"
        echo ""
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --docker-only  Setup only Docker environment"
        echo "  --no-docker    Setup without Docker"
        echo ""
        exit 0
        ;;
    --docker-only)
        print_status "Setting up Docker environment only..."
        check_requirements
        create_directories
        create_env_files
        setup_docker
        show_usage
        ;;
    --no-docker)
        print_status "Setting up without Docker..."
        check_requirements
        create_directories
        create_env_files
        setup_backend
        setup_frontend
        echo ""
        print_success "Setup completed! Use 'cd backend && python -m uvicorn app.main:app --reload' and 'cd frontend && npm run dev' to start services."
        ;;
    *)
        main
        ;;
esac
