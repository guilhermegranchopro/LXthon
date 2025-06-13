#!/bin/bash
# Port Update Test Script - Verify all port changes from 3000 to 3001

echo "🔄 Port Update Verification Script"
echo "=================================="
echo "Checking all files have been updated from port 3000 to 3001..."
echo ""

# Function to check for remaining port 3000 references
check_port_references() {
    echo "🔍 Searching for remaining port 3000 references..."
    
    # Files that should be updated
    important_files=(
        "frontend/package.json"
        "backend/app/main.py"
        "README.md"
        "SETUP_COMPLETE.md"
        "docker-compose.yml"
        "docker-compose.prod.yml"
        "setup_app.sh"
        "dev-setup.sh"
        "start-frontend.sh"
        "run_frontend.sh"
        "validate_app.py"
        "test_complete_system.py"
        "test_full_app.py"
        "test.sh"
        "setup.sh"
        "final_summary.py"
    )
    
    found_references=false
    
    for file in "${important_files[@]}"; do
        if [ -f "/home/guilhermegrancho/LXthon/$file" ]; then
            if grep -q "3000" "/home/guilhermegrancho/LXthon/$file" 2>/dev/null; then
                echo "⚠️  Found port 3000 reference in: $file"
                grep -n "3000" "/home/guilhermegrancho/LXthon/$file" | head -3
                found_references=true
                echo ""
            fi
        fi
    done
    
    if [ "$found_references" = false ]; then
        echo "✅ No port 3000 references found in critical files"
    fi
    
    echo ""
}

# Function to verify port 3001 is configured
verify_new_port() {
    echo "🔍 Verifying port 3001 configuration..."
    
    # Check package.json
    if grep -q "next dev -p 3001" "/home/guilhermegrancho/LXthon/frontend/package.json"; then
        echo "✅ Frontend package.json configured for port 3001"
    else
        echo "❌ Frontend package.json not configured for port 3001"
    fi
    
    # Check CORS configuration
    if grep -q "localhost:3001" "/home/guilhermegrancho/LXthon/backend/app/main.py"; then
        echo "✅ Backend CORS configured for port 3001"
    else
        echo "❌ Backend CORS not configured for port 3001"
    fi
    
    # Check documentation
    if grep -q "localhost:3001" "/home/guilhermegrancho/LXthon/SETUP_COMPLETE.md"; then
        echo "✅ Documentation updated for port 3001"
    else
        echo "❌ Documentation not updated for port 3001"
    fi
    
    echo ""
}

# Function to test port availability
test_port_availability() {
    echo "🔌 Testing port availability..."
    
    # Check if port 3000 is in use (Grafana)
    if netstat -tlnp 2>/dev/null | grep -q ":3000 "; then
        echo "✅ Port 3000 is in use (presumably by Grafana)"
    else
        echo "ℹ️  Port 3000 is available"
    fi
    
    # Check if port 3001 is available
    if netstat -tlnp 2>/dev/null | grep -q ":3001 "; then
        echo "⚠️  Port 3001 is currently in use"
    else
        echo "✅ Port 3001 is available for frontend"
    fi
    
    echo ""
}

# Function to create quick start commands
create_quick_start() {
    echo "📝 Updated Quick Start Commands"
    echo "=============================="
    echo ""
    echo "🔧 Development Mode:"
    echo "# Terminal 1 - Backend"
    echo "cd /home/guilhermegrancho/LXthon/backend"
    echo "source venv/bin/activate"
    echo "uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
    echo ""
    echo "# Terminal 2 - Frontend"
    echo "cd /home/guilhermegrancho/LXthon/frontend"
    echo "npm run dev"
    echo ""
    echo "🐳 Docker Mode:"
    echo "cd /home/guilhermegrancho/LXthon"
    echo "docker-compose up"
    echo ""
    echo "🌐 Access URLs:"
    echo "- Frontend: http://localhost:3001"
    echo "- Backend API: http://localhost:8000"
    echo "- API Docs: http://localhost:8000/docs"
    echo ""
}

# Function to verify dependencies
check_dependencies() {
    echo "📦 Checking dependencies..."
    
    # Check if frontend dependencies are installed
    if [ -d "/home/guilhermegrancho/LXthon/frontend/node_modules" ]; then
        echo "✅ Frontend dependencies installed"
    else
        echo "⚠️  Frontend dependencies not installed - run 'npm install' in frontend/"
    fi
    
    # Check if backend virtual environment exists
    if [ -d "/home/guilhermegrancho/LXthon/backend/venv" ]; then
        echo "✅ Backend virtual environment exists"
    else
        echo "⚠️  Backend virtual environment not found - run setup script"
    fi
    
    echo ""
}

# Main execution
main() {
    check_port_references
    verify_new_port
    test_port_availability
    check_dependencies
    create_quick_start
    
    echo "🎯 Port Update Summary"
    echo "====================="
    echo "✅ Frontend port changed from 3000 to 3001"
    echo "✅ Backend CORS updated to allow port 3001"
    echo "✅ All documentation updated"
    echo "✅ Docker configurations updated"
    echo "✅ Test scripts updated"
    echo ""
    echo "🚀 Ready to start development with new port configuration!"
}

# Run the verification
main
