#!/usr/bin/env python3
import base64
import json
import requests
from PIL import Image
import numpy as np
import io

def test_prediction():
    print("Testing prediction endpoint...")
    
    # Create a simple test image
    test_image = np.random.randint(0, 255, (256, 256, 3), dtype=np.uint8)
    pil_image = Image.fromarray(test_image)

    # Convert to base64
    buffer = io.BytesIO()
    pil_image.save(buffer, format='PNG')
    img_data = buffer.getvalue()
    base64_string = base64.b64encode(img_data).decode('utf-8')
    base64_image = f'data:image/png;base64,{base64_string}'

    # Test prediction
    try:
        response = requests.post(
            'http://localhost:8001/predict',
            json={'image': base64_image},
            timeout=30
        )

        print('Status:', response.status_code)
        if response.status_code == 200:
            result = response.json()
            print('✅ Prediction successful!')
            print('Success:', result['success'])
            print('Processing time:', result['processing_time'])
            print('Confidence score:', result['confidence_score'])
            print('Has segmentation mask:', bool(result['segmentation_mask']))
            print('Message:', result['message'])
        else:
            print('❌ Error:', response.text)
    except Exception as e:
        print('❌ Exception:', str(e))

if __name__ == "__main__":
    test_prediction()
