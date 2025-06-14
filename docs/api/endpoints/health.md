# Health Check Endpoint

## `GET /health`

Check the health status of the API and ML model.

### Description

Returns the current health status of the service, including whether the ML model is properly loaded and ready to make predictions.

### Request

```bash
curl -X GET "http://localhost:8001/health" \
  -H "Accept: application/json"
```

### Response

```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Service status (`healthy` or `unhealthy`) |
| `model_loaded` | boolean | Whether the ML model is loaded |
| `version` | string | API version |

### Status Codes

- `200 OK` - Service is healthy
- `500 Internal Server Error` - Service is unhealthy

### Error Response

When the service is unhealthy:

```json
{
  "error": "Health check failed: Model not loaded",
  "status_code": 500
}
```

### Example Usage

#### Python
```python
import requests

def check_api_health():
    try:
        response = requests.get("http://localhost:8001/health", timeout=5)
        health = response.json()
        
        if health["status"] == "healthy" and health["model_loaded"]:
            print("✅ API is ready for predictions")
            return True
        else:
            print("❌ API is not ready")
            return False
    except requests.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False

# Usage
if check_api_health():
    # Proceed with predictions
    pass
```

#### JavaScript
```javascript
async function checkHealth() {
  try {
    const response = await fetch('http://localhost:8001/health');
    const health = await response.json();
    
    if (health.status === 'healthy' && health.model_loaded) {
      console.log('✅ API is ready');
      return true;
    } else {
      console.log('❌ API is not ready');
      return false;
    }
  } catch (error) {
    console.log(`❌ Health check failed: ${error}`);
    return false;
  }
}
```

#### cURL
```bash
# Simple health check
curl -s http://localhost:8001/health | jq '.status'

# Full health status
curl -s http://localhost:8001/health | jq '.'

# Health check with exit code
curl -sf http://localhost:8001/health > /dev/null && echo "API is healthy" || echo "API is down"
```

### Performance

- **Response Time**: < 100ms
- **Payload Size**: ~100 bytes
- **Rate Limit**: None

### Use Cases

1. **Service Monitoring**: Regular health checks in production
2. **Load Balancer**: Health endpoint for load balancer checks
3. **CI/CD Pipeline**: Verify deployment health
4. **Client Validation**: Ensure API is ready before making requests

### Notes

- This endpoint should be used before making prediction requests
- Model loading can take several seconds during startup
- Health checks are lightweight and safe to call frequently
