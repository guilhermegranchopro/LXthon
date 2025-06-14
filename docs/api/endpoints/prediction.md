# Image Prediction Endpoints

## Overview

Two endpoints are available for blood vessel segmentation predictions:

1. **`POST /predict`** - Base64 encoded image prediction
2. **`POST /predict/file`** - Direct file upload (recommended)

---

## `POST /predict`

Predict blood vessel segmentation from a base64 encoded image.

### Request Body

```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "model_name": "unet_eye_segmentation"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | string | Yes | Base64 encoded image with data URI prefix |
| `model_name` | string | No | Model name (default: "unet_eye_segmentation") |

### Response

```json
{
  "success": true,
  "segmentation_mask": "data:image/png;base64,iVBORw0KGgo...",
  "confidence_score": 0.92,
  "processing_time": 3.45,
  "message": "Segmentation completed successfully"
}
```

### Example Request

```bash
curl -X POST "http://localhost:8001/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAY...",
    "model_name": "unet_eye_segmentation"
  }'
```

---

## `POST /predict/file` (Recommended)

Upload an image file directly for segmentation. This method is more efficient and easier to use.

### Request

Multipart form data with image file:

```bash
curl -X POST "http://localhost:8001/predict/file" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@eye_image.jpg"
```

### Supported File Types

- **JPEG** (`.jpg`, `.jpeg`) - Recommended
- **PNG** (`.png`)
- **BMP** (`.bmp`)
- **TIFF** (`.tiff`, `.tif`)

### File Size Limits

- **Maximum**: 10MB
- **Recommended**: < 5MB for optimal performance
- **Image Resolution**: 512x512 to 2048x2048 pixels

---

## Response Format (Both Endpoints)

### Success Response

```json
{
  "success": true,
  "segmentation_mask": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "confidence_score": 0.89,
  "processing_time": 4.12,
  "message": "Segmentation completed successfully"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether prediction was successful |
| `segmentation_mask` | string | Base64 encoded binary mask (PNG format) |
| `confidence_score` | float | Average confidence score (0.0-1.0) |
| `processing_time` | float | Processing time in seconds |
| `message` | string | Status message |

### Error Response

```json
{
  "success": false,
  "segmentation_mask": null,
  "confidence_score": null,
  "processing_time": null,
  "message": "Error: Invalid image format"
}
```

---

## Status Codes

- `200 OK` - Prediction successful
- `400 Bad Request` - Invalid request (missing image, wrong format)
- `413 Payload Too Large` - Image file too large
- `422 Unprocessable Entity` - Invalid image data
- `500 Internal Server Error` - Model prediction failed

---

## Example Usage

### Python Example

```python
import requests
import base64
from io import BytesIO
from PIL import Image

def predict_vessels_from_file(image_path):
    """Predict vessels using file upload endpoint"""
    with open(image_path, 'rb') as image_file:
        files = {'image': image_file}
        response = requests.post(
            'http://localhost:8001/predict/file',
            files=files
        )
    
    if response.status_code == 200:
        result = response.json()
        if result['success']:
            print(f"✅ Prediction successful!")
            print(f"📊 Confidence: {result['confidence_score']:.3f}")
            print(f"⏱️ Processing time: {result['processing_time']:.2f}s")
            
            # Decode and save segmentation mask
            mask_data = result['segmentation_mask']
            # Remove data:image/png;base64, prefix
            mask_b64 = mask_data.split(',')[1]
            mask_bytes = base64.b64decode(mask_b64)
            
            # Save mask
            with open('segmentation_mask.png', 'wb') as f:
                f.write(mask_bytes)
            
            return result
        else:
            print(f"❌ Prediction failed: {result['message']}")
    else:
        print(f"❌ Request failed: {response.status_code}")
    
    return None

def predict_vessels_from_base64(image_path):
    """Predict vessels using base64 endpoint"""
    # Read and encode image
    with open(image_path, 'rb') as image_file:
        image_data = image_file.read()
        image_b64 = base64.b64encode(image_data).decode('utf-8')
        
        # Create data URI
        image_uri = f"data:image/jpeg;base64,{image_b64}"
    
    # Make request
    payload = {
        'image': image_uri,
        'model_name': 'unet_eye_segmentation'
    }
    
    response = requests.post(
        'http://localhost:8001/predict',
        json=payload
    )
    
    return response.json()

# Usage examples
result = predict_vessels_from_file('path/to/eye_image.jpg')
# or
result = predict_vessels_from_base64('path/to/eye_image.jpg')
```

### JavaScript Example

```javascript
async function predictVesselsFromFile(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    const response = await fetch('http://localhost:8001/predict/file', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Prediction successful!`);
      console.log(`📊 Confidence: ${result.confidence_score.toFixed(3)}`);
      console.log(`⏱️ Processing time: ${result.processing_time.toFixed(2)}s`);
      
      // Display segmentation mask
      const maskImg = document.createElement('img');
      maskImg.src = result.segmentation_mask;
      document.body.appendChild(maskImg);
      
      return result;
    } else {
      console.log(`❌ Prediction failed: ${result.message}`);
      return null;
    }
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
}

// Usage with file input
document.getElementById('imageInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    predictVesselsFromFile(file);
  }
});
```

---

## Performance Tips

1. **Use `/predict/file`** - More efficient than base64 encoding
2. **Optimize image size** - Resize to 512x512 or 1024x1024 for best performance
3. **Use JPEG format** - Better compression for eye fundus images
4. **Implement timeout** - Set request timeout to 30+ seconds
5. **Handle errors gracefully** - Always check the `success` field
6. **Cache results** - Store results to avoid repeated processing

---

## Integration Examples

### React Component

```jsx
import React, { useState } from 'react';

function VesselSegmentation() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setLoading(true);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch('/api/predict/file', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      setResult(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      {loading && <p>Processing...</p>}
      {result && result.success && (
        <div>
          <p>Confidence: {result.confidence_score.toFixed(3)}</p>
          <img src={result.segmentation_mask} alt="Segmentation" />
        </div>
      )}
    </div>
  );
}
```

---

## Notes

- **Processing time** varies from 2-8 seconds depending on image size and server load
- **GPU acceleration** is used when available for faster inference
- **Memory usage** peaks during processing but is automatically cleaned up
- **Batch processing** is not currently supported (single image per request)
- **Image preprocessing** is handled automatically (resizing, normalization)
