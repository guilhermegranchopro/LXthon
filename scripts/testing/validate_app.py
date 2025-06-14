#!/usr/bin/env python3
"""
Quick validation script for the eye vessel segmentation application
"""
import sys
import os
import importlib.util

def test_backend_imports():
    """Test if backend modules can be imported"""
    print("🔍 Testing backend imports...")
    
    # Add backend to path
    backend_path = '/home/guilhermegrancho/LXthon/backend'
    if backend_path not in sys.path:
        sys.path.insert(0, backend_path)
    
    try:
        # Test FastAPI app
        from app.main import app
        print("✅ FastAPI app imported successfully")
        
        # Test model service
        from app.services.model_service import ModelService
        print("✅ Model service imported successfully")
        
        # Test model file exists
        model_path = '/home/guilhermegrancho/LXthon/backend/models/unet_eye_segmentation.keras'
        if os.path.exists(model_path):
            print("✅ Model file exists")
        else:
            print("❌ Model file not found")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_model_loading():
    """Test if the model can be loaded"""
    print("🧠 Testing model loading...")
    
    backend_path = '/home/guilhermegrancho/LXthon/backend'
    if backend_path not in sys.path:
        sys.path.insert(0, backend_path)
    
    try:
        from app.services.model_service import ModelService
        
        # Try to initialize the model service
        service = ModelService()
        print("✅ Model loaded successfully")
        
        # Check model input size
        print(f"📏 Model input size: {service.input_size}")
        
        return True
        
    except Exception as e:
        print(f"❌ Model loading error: {e}")
        return False

def test_frontend_config():
    """Test frontend configuration"""
    print("🎨 Testing frontend configuration...")
    
    frontend_path = '/home/guilhermegrancho/LXthon/frontend'
    
    # Check required files
    required_files = [
        'package.json',
        'tsconfig.json',
        'next.config.js',
        'tailwind.config.js',
        'src/app/page.tsx'
    ]
    
    for file in required_files:
        file_path = os.path.join(frontend_path, file)
        if os.path.exists(file_path):
            print(f"✅ {file} exists")
        else:
            print(f"❌ {file} missing")
            return False
    
    # Check node_modules
    node_modules_path = os.path.join(frontend_path, 'node_modules')
    if os.path.exists(node_modules_path):
        print("✅ node_modules directory exists")
    else:
        print("❌ node_modules directory missing - run npm install")
        return False
    
    return True

def main():
    """Run all validation tests"""
    print("🔍 Application Validation")
    print("=" * 40)
    
    tests = [
        ("Backend Imports", test_backend_imports),
        ("Model Loading", test_model_loading),
        ("Frontend Config", test_frontend_config)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}:")
        if test_func():
            passed += 1
        print()
    
    print("=" * 40)
    print(f"📊 Validation Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All validation tests passed!")
        print("\n🚀 Application is ready to run!")
        print("\nNext steps:")
        print("1. Start backend: cd /home/guilhermegrancho/LXthon/backend && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000")
        print("2. Start frontend: cd /home/guilhermegrancho/LXthon/frontend && npm run dev")
        print("3. Open browser: http://localhost:3001")
        return True
    else:
        print("❌ Some validation tests failed")
        print("Please fix the issues before running the application")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
