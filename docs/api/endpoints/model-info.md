# Model Information Endpoint

## `GET /model/info`

Get detailed information about the loaded U-Net model.

### Description

Returns comprehensive information about the current ML model, including architecture details, performance metrics, and training information.

### Request

```bash
curl -X GET "http://localhost:8001/model/info" \
  -H "Accept: application/json"
```

### Response

```json
{
  "model_name": "unet_eye_segmentation",
  "version": "1.0.0",
  "architecture": "U-Net",
  "parameters": {
    "total": 24400000,
    "trainable": 24400000,
    "non_trainable": 0
  },
  "input_shape": [512, 512, 3],
  "output_shape": [512, 512, 1],
  "model_size_mb": 293.5,
  "framework": "TensorFlow",
  "framework_version": "2.13.0",
  "training_info": {
    "dataset": "Custom eye vessel dataset",
    "epochs": 100,
    "batch_size": 8,
    "optimizer": "Adam",
    "loss_function": "binary_crossentropy",
    "metrics": ["accuracy", "dice_coefficient"]
  },
  "performance": {
    "accuracy": 0.925,
    "dice_coefficient": 0.887,
    "iou_score": 0.798,
    "precision": 0.912,
    "recall": 0.864,
    "f1_score": 0.887
  },
  "inference": {
    "avg_processing_time": 3.8,
    "memory_usage_mb": 1200,
    "gpu_acceleration": true
  },
  "last_updated": "2025-06-14T00:00:00Z",
  "file_path": "/app/models/unet_eye_segmentation.keras"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `model_name` | string | Name of the model |
| `version` | string | Model version |
| `architecture` | string | Neural network architecture |
| `parameters` | object | Model parameter counts |
| `input_shape` | array | Expected input dimensions [height, width, channels] |
| `output_shape` | array | Output dimensions [height, width, channels] |
| `model_size_mb` | float | Model file size in megabytes |
| `framework` | string | ML framework used |
| `framework_version` | string | Framework version |
| `training_info` | object | Training configuration details |
| `performance` | object | Model performance metrics |
| `inference` | object | Runtime performance information |
| `last_updated` | string | Last model update timestamp |
| `file_path` | string | Model file location |

### Performance Metrics Explained

#### Training Metrics
- **Accuracy**: Overall prediction accuracy (0-1)
- **Dice Coefficient**: Overlap measure for segmentation quality
- **IoU Score**: Intersection over Union for segmentation overlap
- **Precision**: True positive rate
- **Recall**: Sensitivity or true positive rate
- **F1 Score**: Harmonic mean of precision and recall

#### Inference Metrics
- **avg_processing_time**: Average prediction time in seconds
- **memory_usage_mb**: Peak memory usage during inference
- **gpu_acceleration**: Whether GPU is used for inference

### Status Codes

- `200 OK` - Model information retrieved successfully
- `500 Internal Server Error` - Failed to get model information

### Error Response

```json
{
  "error": "Failed to get model info: Model not loaded",
  "status_code": 500
}
```

### Example Usage

#### Python
```python
import requests

def get_model_info():
    try:
        response = requests.get("http://localhost:8001/model/info")
        model_info = response.json()
        
        print(f"🤖 Model: {model_info['model_name']} v{model_info['version']}")
        print(f"🏗️ Architecture: {model_info['architecture']}")
        print(f"📊 Parameters: {model_info['parameters']['total']:,}")
        print(f"📏 Input Shape: {model_info['input_shape']}")
        print(f"💾 Size: {model_info['model_size_mb']:.1f} MB")
        print(f"🎯 Accuracy: {model_info['performance']['accuracy']:.3f}")
        print(f"⏱️ Avg Processing: {model_info['inference']['avg_processing_time']:.1f}s")
        
        return model_info
    except requests.RequestException as e:
        print(f"❌ Failed to get model info: {e}")
        return None

# Usage
model_info = get_model_info()
```

#### JavaScript
```javascript
async function getModelInfo() {
  try {
    const response = await fetch('http://localhost:8001/model/info');
    const modelInfo = await response.json();
    
    console.log(`🤖 Model: ${modelInfo.model_name} v${modelInfo.version}`);
    console.log(`🏗️ Architecture: ${modelInfo.architecture}`);
    console.log(`📊 Parameters: ${modelInfo.parameters.total.toLocaleString()}`);
    console.log(`📏 Input Shape: ${modelInfo.input_shape.join('x')}`);
    console.log(`💾 Size: ${modelInfo.model_size_mb.toFixed(1)} MB`);
    console.log(`🎯 Accuracy: ${modelInfo.performance.accuracy.toFixed(3)}`);
    console.log(`⏱️ Avg Processing: ${modelInfo.inference.avg_processing_time.toFixed(1)}s`);
    
    return modelInfo;
  } catch (error) {
    console.error('❌ Failed to get model info:', error);
    return null;
  }
}

// Usage
getModelInfo();
```

#### cURL with formatting
```bash
# Get formatted model information
curl -s http://localhost:8001/model/info | jq '{
  name: .model_name,
  version: .version,
  architecture: .architecture,
  parameters: .parameters.total,
  accuracy: .performance.accuracy,
  processing_time: .inference.avg_processing_time
}'

# Get specific metric
curl -s http://localhost:8001/model/info | jq '.performance.accuracy'

# Check if GPU is enabled
curl -s http://localhost:8001/model/info | jq '.inference.gpu_acceleration'
```

### Performance

- **Response Time**: < 200ms
- **Payload Size**: ~800 bytes
- **Rate Limit**: None

### Use Cases

1. **Model Validation**: Verify correct model is loaded
2. **Performance Monitoring**: Track model performance metrics
3. **Client Configuration**: Adjust client behavior based on model capabilities
4. **Debugging**: Troubleshoot model-related issues
5. **Documentation**: Generate model documentation automatically

### Integration Examples

#### React Model Info Component

```jsx
import React, { useState, useEffect } from 'react';

function ModelInfo() {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchModelInfo() {
      try {
        const response = await fetch('/api/model/info');
        const info = await response.json();
        setModelInfo(info);
      } catch (error) {
        console.error('Failed to fetch model info:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchModelInfo();
  }, []);
  
  if (loading) return <div>Loading model info...</div>;
  if (!modelInfo) return <div>Failed to load model info</div>;
  
  return (
    <div className="model-info">
      <h3>🤖 {modelInfo.model_name} v{modelInfo.version}</h3>
      <div className="metrics">
        <div>🏗️ Architecture: {modelInfo.architecture}</div>
        <div>📊 Parameters: {modelInfo.parameters.total.toLocaleString()}</div>
        <div>🎯 Accuracy: {(modelInfo.performance.accuracy * 100).toFixed(1)}%</div>
        <div>⏱️ Avg Processing: {modelInfo.inference.avg_processing_time.toFixed(1)}s</div>
        <div>💾 Model Size: {modelInfo.model_size_mb.toFixed(1)} MB</div>
        <div>🚀 GPU Acceleration: {modelInfo.inference.gpu_acceleration ? '✅' : '❌'}</div>
      </div>
    </div>
  );
}
```

### Notes

- Model information is cached and updated when the model is reloaded
- Performance metrics are based on training data and may vary in production
- GPU acceleration availability depends on server configuration
- Processing times may vary based on server load and image complexity
