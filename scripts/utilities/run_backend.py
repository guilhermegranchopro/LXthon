#!/usr/bin/env python3
"""
Simple script to run the FastAPI backend server
"""
import uvicorn
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, '/home/guilhermegrancho/LXthon/backend')

if __name__ == "__main__":
    print("🚀 Starting FastAPI backend server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📍 API docs will be available at: http://localhost:8000/docs")
    print("❌ Press Ctrl+C to stop the server")
    
    try:
        # Change to backend directory
        os.chdir('/home/guilhermegrancho/LXthon/backend')
        
        # Run the FastAPI app
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        import traceback
        traceback.print_exc()
