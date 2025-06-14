#!/usr/bin/env python3
"""
Create a dummy model for testing the application
"""

import os
import numpy as np

def create_dummy_model():
    """Create a dummy model file for testing"""
    os.makedirs('backend/models', exist_ok=True)
    
    # Create a simple dummy model data
    model_data = {
        'model_type': 'unet_eye_segmentation',
        'input_shape': [256, 256, 3],
        'output_shape': [256, 256, 1],
        'version': '1.0.0',
        'dummy': True
    }
    
    # Save as a simple pickle-like format
    import pickle
    with open('backend/models/unet_eye_segmentation.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("✅ Dummy model created at backend/models/unet_eye_segmentation.pkl")

if __name__ == "__main__":
    create_dummy_model()
