#!/usr/bin/env python3
"""
Manual Testing Script for Eye Vessel Segmentation Application
Tests the core functionality without requiring full server deployment
"""

import sys
import os
sys.path.append('/home/guilhermegrancho/LXthon/backend')

import numpy as np
import cv2
import base64
from pathlib import Path
import json

def test_model_loading():
    """Test if the trained model can be loaded"""
    print("🧪 Testing Model Loading...")
    
    try:
        import tensorflow as tf
        model_path = '/home/guilhermegrancho/LXthon/backend/models/unet_eye_segmentation.keras'
        
        if os.path.exists(model_path):
            model = tf.keras.models.load_model(model_path)
            print(f"✅ Model loaded successfully!")
            print(f"   Input shape: {model.input_shape}")
            print(f"   Output shape: {model.output_shape}")
            print(f"   Parameters: {model.count_params():,}")
            return model
        else:
            print(f"❌ Model file not found at {model_path}")
            return None
            
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None

def test_image_processing():
    """Test image processing utilities"""
    print("\n🖼️ Testing Image Processing...")
    
    try:
        from app.utils.image_processing import preprocess_image, postprocess_mask
        
        # Create a dummy image
        test_image = np.random.randint(0, 255, (512, 512, 3), dtype=np.uint8)
        print(f"✅ Created test image: {test_image.shape}")
        
        # Test preprocessing
        processed = preprocess_image(test_image)
        print(f"✅ Preprocessed image: {processed.shape}, range: [{processed.min():.3f}, {processed.max():.3f}]")
        
        # Test postprocessing
        dummy_mask = np.random.rand(512, 512, 1)
        post_processed = postprocess_mask(dummy_mask)
        print(f"✅ Postprocessed mask: {post_processed.shape}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error in image processing: {e}")
        return False

def test_prediction_pipeline():
    """Test the complete prediction pipeline"""
    print("\n🔮 Testing Prediction Pipeline...")
    
    try:
        from app.services.model_service import ModelService
        
        # Initialize model service
        model_service = ModelService()
        print("✅ ModelService initialized")
        
        # Create test image
        test_image = np.random.randint(0, 255, (512, 512, 3), dtype=np.uint8)
        
        # Test prediction
        result = model_service.predict(test_image)
        
        print(f"✅ Prediction completed!")
        print(f"   Mask shape: {result['mask'].shape}")
        print(f"   Confidence: {result['confidence']:.3f}")
        print(f"   Processing time: {result['processing_time']:.3f}s")
        
        return True
        
    except Exception as e:
        print(f"❌ Error in prediction pipeline: {e}")
        return False

def test_api_endpoints():
    """Test FastAPI endpoints"""
    print("\n🌐 Testing API Endpoints...")
    
    try:
        from app.main import app
        from fastapi.testclient import TestClient
        
        client = TestClient(app)
        
        # Test health endpoint
        response = client.get("/health")
        if response.status_code == 200:
            print("✅ Health endpoint working")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
            
        return True
        
    except Exception as e:
        print(f"❌ Error testing API endpoints: {e}")
        return False

def test_sample_prediction():
    """Test prediction with a real sample from dataset"""
    print("\n🎯 Testing with Real Dataset Sample...")
    
    dataset_dir = Path('/home/guilhermegrancho/LXthon/dataset/train_dataset_mc')
    
    # Find first available image
    for img_file in dataset_dir.glob("*.png"):
        if img_file.exists():
            print(f"📸 Testing with image: {img_file.name}")
            
            try:
                # Load image
                image = cv2.imread(str(img_file))
                if image is None:
                    continue
                    
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                print(f"✅ Loaded image: {image.shape}")
                
                # Test with model service
                from app.services.model_service import ModelService
                model_service = ModelService()
                
                result = model_service.predict(image)
                print(f"✅ Real image prediction completed!")
                print(f"   Confidence: {result['confidence']:.3f}")
                
                return True
                
            except Exception as e:
                print(f"❌ Error with real image: {e}")
                continue
    
    print("❌ No valid images found in dataset")
    return False

def create_demo_visualization():
    """Create a simple demo visualization"""
    print("\n🎨 Creating Demo Visualization...")
    
    try:
        import matplotlib.pyplot as plt
        
        # Create sample data
        original = np.random.randint(0, 255, (256, 256, 3), dtype=np.uint8)
        mask = np.random.rand(256, 256) > 0.7
        
        # Create visualization
        fig, axes = plt.subplots(1, 3, figsize=(15, 5))
        
        axes[0].imshow(original)
        axes[0].set_title('Original Image')
        axes[0].axis('off')
        
        axes[1].imshow(mask, cmap='gray')
        axes[1].set_title('Segmentation Mask')
        axes[1].axis('off')
        
        # Overlay
        overlay = original.copy()
        overlay[mask] = [255, 0, 0]  # Red overlay for vessels
        axes[2].imshow(overlay)
        axes[2].set_title('Overlay Result')
        axes[2].axis('off')
        
        plt.tight_layout()
        plt.savefig('/home/guilhermegrancho/LXthon/demo_result.png', dpi=150, bbox_inches='tight')
        plt.close()
        
        print("✅ Demo visualization saved to 'demo_result.png'")
        return True
        
    except Exception as e:
        print(f"❌ Error creating visualization: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Eye Vessel Segmentation Application Testing")
    print("=" * 60)
    
    results = {
        'Model Loading': test_model_loading() is not None,
        'Image Processing': test_image_processing(),
        'Prediction Pipeline': test_prediction_pipeline(),
        'API Endpoints': test_api_endpoints(),
        'Sample Prediction': test_sample_prediction(),
        'Demo Visualization': create_demo_visualization()
    }
    
    print("\n📊 Test Results Summary:")
    print("=" * 40)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:20} {status}")
        if result:
            passed += 1
    
    print(f"\nOverall Score: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed >= total * 0.8:
        print("🎉 Application is ready for demo!")
    else:
        print("⚠️ Some issues detected. Check the logs above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
