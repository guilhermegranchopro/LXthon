#!/bin/bash
# Updated Application Startup Script
# Frontend now runs on port 3001 to avoid conflict with Grafana on port 3000

echo "🚀 Eye Vessel Segmentation Application"
echo "====================================="
echo ""
echo "ℹ️  Frontend configured for port 3001 (Grafana-friendly)"
echo ""

# Function to check if a port is in use
check_port() {
    local port=$1
    if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
        return 0  # Port is in use
    else
        return 1  # Port is available
    fi
}

# Function to start backend
start_backend() {
    echo "🔧 Starting Backend..."
    
    cd /home/guilhermegrancho/LXthon/backend
    
    if [ ! -d "venv" ]; then
        echo "📦 Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    
    echo "📦 Installing/updating dependencies..."
    pip install -q -r requirements.txt
    
    echo "✅ Backend ready on port 8000"
    echo "🌐 API docs: http://localhost:8000/docs"
    echo ""
    
    # Start backend in background
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    
    # Wait a moment for backend to start
    sleep 3
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend..."
    
    cd /home/guilhermegrancho/LXthon/frontend
    
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing Node.js dependencies..."
        npm install
    fi
    
    echo "✅ Frontend ready on port 3001"
    echo "🌐 Application: http://localhost:3001"
    echo ""
    
    # Start frontend
    npm run dev
}

# Function to check service status
check_services() {
    echo "🔍 Service Status Check..."
    
    if check_port 3000; then
        echo "✅ Port 3000 in use (likely Grafana)"
    else
        echo "ℹ️  Port 3000 available"
    fi
    
    if check_port 3001; then
        echo "⚠️  Port 3001 in use - may conflict with frontend"
    else
        echo "✅ Port 3001 available for frontend"
    fi
    
    if check_port 8000; then
        echo "⚠️  Port 8000 in use - may conflict with backend"
    else
        echo "✅ Port 8000 available for backend"
    fi
    
    echo ""
}

# Function to display help
show_help() {
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  --backend-only    Start only the backend service"
    echo "  --frontend-only   Start only the frontend service"
    echo "  --check-ports     Check port availability"
    echo "  --help           Show this help message"
    echo ""
    echo "Default: Start both backend and frontend"
    echo ""
    echo "Access URLs:"
    echo "  Frontend:  http://localhost:3001"
    echo "  Backend:   http://localhost:8000"
    echo "  API Docs:  http://localhost:8000/docs"
}

# Main execution
case "${1:-}" in
    --backend-only)
        echo "🔧 Starting backend only..."
        check_services
        start_backend
        echo "Backend running. Press Ctrl+C to stop."
        wait $BACKEND_PID
        ;;
    --frontend-only)
        echo "🎨 Starting frontend only..."
        check_services
        start_frontend
        ;;
    --check-ports)
        check_services
        ;;
    --help)
        show_help
        ;;
    *)
        echo "🚀 Starting full application..."
        check_services
        
        # Start backend first
        start_backend
        
        # Start frontend (this will block)
        start_frontend
        ;;
esac
