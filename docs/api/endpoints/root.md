# Root Endpoint

## `GET /`

Get API information and overview of available endpoints.

### Description

Returns basic information about the API, including version, description, and a list of all available endpoints.

### Request

```bash
curl -X GET "http://localhost:8001/" \
  -H "Accept: application/json"
```

### Response

```json
{
  "message": "Eye Vessel Segmentation API",
  "version": "1.0.0",
  "description": "API for segmenting blood vessels in slit-lamp eye images",
  "endpoints": {
    "health": "/health",
    "predict": "/predict",
    "predict_file": "/predict/file",
    "docs": "/docs",
    "redoc": "/redoc"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | API name |
| `version` | string | Current API version |
| `description` | string | Brief API description |
| `endpoints` | object | Available API endpoints |

### Status Codes

- `200 OK` - Success
- `500 Internal Server Error` - Server error

### Example Usage

#### Python
```python
import requests

response = requests.get("http://localhost:8001/")
data = response.json()
print(f"API: {data['message']} v{data['version']}")
```

#### JavaScript
```javascript
fetch('http://localhost:8001/')
  .then(response => response.json())
  .then(data => console.log(`API: ${data.message} v${data.version}`));
```

#### cURL
```bash
curl -s http://localhost:8001/ | jq '.message'
```

### Performance

- **Response Time**: < 50ms
- **Payload Size**: ~200 bytes
- **Rate Limit**: None
