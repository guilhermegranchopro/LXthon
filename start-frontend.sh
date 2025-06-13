#!/bin/bash
# Frontend setup and start script

echo "🌐 Setting up Frontend Development Environment"
echo "=============================================="

# Navigate to frontend directory
cd frontend

# Check if Node.js and npm are available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully!"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating environment configuration..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
    echo "✅ Environment file created"
fi

# Build the application to check for errors
echo "🏗️ Building frontend application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed - check the errors above"
    exit 1
fi

echo ""
echo "🎉 Frontend setup complete!"
echo ""
echo "🚀 Starting development server..."
echo "   Frontend URL: http://localhost:3001"
echo "   Make sure backend is running on: http://localhost:8000"
echo ""
echo "🔧 Development commands:"
echo "   npm run dev    - Start development server"
echo "   npm run build  - Build for production"
echo "   npm run start  - Start production server"
echo ""

# Start development server
npm run dev
