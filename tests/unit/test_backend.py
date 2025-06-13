#!/usr/bin/env python3
"""
Simple script to test the backend functionality
"""
import sys
import os
sys.path.append('/home/guilhermegrancho/LXthon/backend')

from app.services.model_service import ModelService
import numpy as np
from PIL import Image
import base64
import io

def test_model_service():
    """Test the model service functionality"""
    print("🧪 Testing Model Service...")
    
    try:
        # Initialize the model service
        service = ModelService()
        print("✅ Model service initialized successfully")
        
        # Create a test image (256x256 as expected by the model)
        test_image = np.random.randint(0, 255, (256, 256, 3), dtype=np.uint8)
        
        # Convert to PIL Image
        pil_image = Image.fromarray(test_image)
        
        # Convert to base64 (simulating frontend upload)
        buffer = io.BytesIO()
        pil_image.save(buffer, format='JPEG')
        base64_string = base64.b64encode(buffer.getvalue()).decode()
        
        print("✅ Test image prepared")
        
        # Test prediction with base64 input
        result = service.predict(base64_string)
        print("✅ Prediction completed")
        
        # Check result format
        required_keys = ['success', 'mask', 'confidence', 'metrics']
        for key in required_keys:
            if key not in result:
                print(f"❌ Missing key in result: {key}")
                return False
        
        print("✅ Result format is correct")
        print(f"📊 Confidence: {result['confidence']:.2f}")
        print(f"📈 Metrics: {result['metrics']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing model service: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_backend_import():
    """Test if all backend modules can be imported"""
    print("📦 Testing backend imports...")
    
    try:
        from app.main import app
        print("✅ FastAPI app imported successfully")
        
        from app.services import model_service
        print("✅ Model service module imported successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Error importing backend modules: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🚀 Starting Backend Tests")
    print("=" * 50)
    
    # Test imports
    if not test_backend_import():
        print("❌ Backend import test failed")
        sys.exit(1)
    
    # Test model service
    if not test_model_service():
        print("❌ Model service test failed")
        sys.exit(1)
    
    print("=" * 50)
    print("✅ All backend tests passed!")
    print("🎉 Backend is ready to run!")
