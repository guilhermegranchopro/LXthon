#!/bin/zsh
# Service Status Check Script

echo "🔍 Checking Service Status"
echo "========================="

# Check if ports are listening
echo "📡 Port Status:"
echo "Frontend (3001): $(lsof -i :3001 >/dev/null 2>&1 && echo "✅ ACTIVE" || echo "❌ INACTIVE")"
echo "Backend (8000):  $(lsof -i :8000 >/dev/null 2>&1 && echo "✅ ACTIVE" || echo "❌ INACTIVE")"

echo ""
echo "🌐 Service Health:"

# Test frontend
if curl -s -f http://localhost:3001 >/dev/null 2>&1; then
    echo "Frontend: ✅ RESPONDING"
else
    echo "Frontend: ❌ NOT RESPONDING"
fi

# Test backend
if curl -s -f http://localhost:8000/ >/dev/null 2>&1; then
    echo "Backend:  ✅ RESPONDING"
else
    echo "Backend:  ❌ NOT RESPONDING"
fi

echo ""
echo "🔗 Access URLs:"
echo "Frontend: http://localhost:3001"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
