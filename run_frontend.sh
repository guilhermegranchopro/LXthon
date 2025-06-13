#!/usr/bin/env bash
"""
Simple script to run the Next.js frontend
"""

echo "🚀 Starting Next.js frontend..."
echo "📍 Frontend will be available at: http://localhost:3000"
echo "❌ Press Ctrl+C to stop the server"

cd /home/guilhermegrancho/LXthon/frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
npm run dev
