#!/usr/bin/env python3
"""
Comprehensive test for the eye vessel segmentation application
"""
import requests
import base64
import io
import time
import sys
from PIL import Image
import numpy as np

def create_test_image():
    """Create a test eye image for testing"""
    # Create a 256x256 test image with some circular patterns (simulating eye vessel)
    img = np.zeros((256, 256, 3), dtype=np.uint8)
    
    # Add some background
    img[:, :] = [50, 30, 30]  # Dark reddish background
    
    # Add some vessel-like patterns
    center_x, center_y = 128, 128
    for angle in range(0, 360, 45):
        x = int(center_x + 100 * np.cos(np.radians(angle)))
        y = int(center_y + 100 * np.sin(np.radians(angle)))
        # Draw a line from center to edge
        for t in np.linspace(0, 1, 100):
            px = int(center_x + t * (x - center_x))
            py = int(center_y + t * (y - center_y))
            if 0 <= px < 256 and 0 <= py < 256:
                img[py, px] = [200, 150, 150]  # Lighter vessel color
    
    return img

def test_backend_health():
    """Test if backend is responding"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend health check passed")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend not reachable: {e}")
        return False

def test_prediction_api():
    """Test the prediction API endpoint"""
    try:
        # Create test image
        test_img = create_test_image()
        pil_img = Image.fromarray(test_img)
        
        # Convert to base64
        buffer = io.BytesIO()
        pil_img.save(buffer, format='JPEG')
        base64_string = base64.b64encode(buffer.getvalue()).decode()
        
        # Test prediction
        print("🧪 Testing prediction API...")
        data = {"image": base64_string}
        
        response = requests.post(
            "http://localhost:8000/predict",
            json=data,
            timeout=30  # Allow time for model inference
        )
        
        if response.status_code == 200:
            result = response.json()
            
            # Check response format
            required_keys = ['success', 'mask', 'confidence', 'metrics']
            for key in required_keys:
                if key not in result:
                    print(f"❌ Missing key in response: {key}")
                    return False
            
            print("✅ Prediction API test passed")
            print(f"📊 Confidence: {result['confidence']:.2f}")
            print(f"📈 Metrics: {result['metrics']}")
            return True
        else:
            print(f"❌ Prediction API failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Prediction API error: {e}")
        return False

def test_frontend():
    """Test if frontend is responding"""
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is responding")
            return True
        else:
            print(f"❌ Frontend test failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Frontend not reachable: {e}")
        return False

def main():
    """Run all tests"""
    print("🔍 Comprehensive Application Test")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 3
    
    # Test backend health
    if test_backend_health():
        tests_passed += 1
    
    # Test prediction API
    if test_prediction_api():
        tests_passed += 1
    
    # Test frontend
    if test_frontend():
        tests_passed += 1
    
    print("=" * 50)
    print(f"📊 Tests passed: {tests_passed}/{total_tests}")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Application is working correctly.")
        print("\n📍 Access points:")
        print("   Frontend: http://localhost:3000")
        print("   Backend API: http://localhost:8000")
        print("   API Docs: http://localhost:8000/docs")
        return True
    else:
        print("❌ Some tests failed. Please check the services.")
        return False

if __name__ == "__main__":
    if main():
        sys.exit(0)
    else:
        sys.exit(1)
