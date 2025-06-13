# 🔌 API Documentation

Complete API reference for the Eye Vessel Segmentation API built with FastAPI 0.115.7.

## 📋 Quick Reference

| Endpoint | Method | Purpose | Response Time |
|----------|--------|---------|---------------|
| `/` | GET | API information | < 50ms |
| `/health` | GET | Health check | < 100ms |
| `/model/info` | GET | Model details | < 200ms |
| `/predict` | POST | Base64 prediction | ~4 seconds |
| `/predict/file` | POST | File upload prediction | ~4 seconds |
| `/docs` | GET | Swagger UI | < 100ms |
| `/redoc` | GET | ReDoc documentation | < 100ms |

## 🌐 Base URL

- **Development**: `http://localhost:8001`
- **Production**: `https://your-api-domain.com`

## 📖 Detailed Documentation

### [Root Endpoint](./endpoints/root.md)
Get API information and available endpoints.

### [Health Monitoring](./endpoints/health.md)
System health checks and status monitoring.

### [Model Information](./endpoints/model-info.md)
Detailed model architecture and performance metrics.

### [Image Prediction](./endpoints/prediction.md)
Blood vessel segmentation endpoints with examples.

### [Interactive Documentation](./endpoints/interactive-docs.md)
Swagger UI and ReDoc access information.

## 🔧 Authentication

Currently, the API does not require authentication for development. Production deployments should implement proper security measures.

## 🛡️ Error Handling

All API endpoints follow consistent error response patterns:

```json
{
  "error": "Error message",
  "detail": "Detailed error information (optional)",
  "status_code": 400
}
```

## 📊 Rate Limiting

- **Development**: No rate limiting
- **Production**: Implement rate limiting based on deployment needs

## 🧪 Testing

Use the provided Swagger UI at `/docs` for interactive testing, or refer to our [API testing guide](../development/api-testing.md).

## 📱 Client Libraries

- **Python**: Use `requests` or `httpx`
- **JavaScript**: Use `fetch` or `axios`
- **cURL**: Examples provided in each endpoint documentation

## 🚀 Performance Tips

1. **Use file upload endpoint** for better performance with large images
2. **Implement proper error handling** for network timeouts
3. **Cache responses** when appropriate
4. **Use appropriate image formats** (JPEG recommended for photos)
5. **Monitor API response times** and implement retries

## 📞 Support

For API-related questions:
- Check the interactive documentation at `/docs`
- Review endpoint-specific documentation in this directory
- Submit issues via GitHub Issues
