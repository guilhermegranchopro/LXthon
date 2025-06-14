# Interactive API Documentation

Access comprehensive, interactive API documentation through multiple interfaces.

## 🎨 Swagger UI

**URL**: [`http://localhost:8001/docs`](http://localhost:8001/docs)

### Features
- **Interactive Testing**: Test API endpoints directly in your browser
- **Request/Response Examples**: See live examples for all endpoints
- **Authentication**: Test with different authentication methods
- **Schema Validation**: Real-time request validation
- **Response Inspection**: View detailed response structures

### How to Use
1. Navigate to `http://localhost:8001/docs`
2. Browse available endpoints organized by category
3. Click "Try it out" on any endpoint
4. Fill in parameters and request body
5. Click "Execute" to test the API
6. View the response with status code and data

### Example Workflow
```bash
# 1. Open Swagger UI
open http://localhost:8001/docs

# 2. Test health endpoint
#    - Click on "GET /health"
#    - Click "Try it out"
#    - Click "Execute"
#    - View response

# 3. Test prediction endpoint
#    - Click on "POST /predict/file"
#    - Click "Try it out"
#    - Upload an image file
#    - Click "Execute"
#    - View segmentation result
```

## 📚 ReDoc Documentation

**URL**: [`http://localhost:8001/redoc`](http://localhost:8001/redoc)

### Features
- **Beautiful Layout**: Clean, professional documentation design
- **Detailed Schemas**: Comprehensive data model documentation
- **Code Examples**: Multi-language code examples
- **Search Functionality**: Quick search through documentation
- **Responsive Design**: Works on desktop and mobile

### Best For
- Reading comprehensive API documentation
- Understanding data models and schemas
- Generating client code examples
- Sharing with team members and stakeholders

## 🔧 OpenAPI Schema

**URL**: [`http://localhost:8001/openapi.json`](http://localhost:8001/openapi.json)

### Features
- **Machine-Readable**: JSON format for automated tools
- **Code Generation**: Generate client libraries automatically
- **API Testing**: Import into testing tools like Postman
- **Documentation**: Generate custom documentation

### Usage Examples

#### Download Schema
```bash
# Download OpenAPI schema
curl -o api-schema.json http://localhost:8001/openapi.json

# View schema structure
jq '.paths | keys' api-schema.json
```

#### Import to Postman
1. Open Postman
2. Click "Import"
3. Paste URL: `http://localhost:8001/openapi.json`
4. Import collection with all endpoints

#### Generate Client Code
```bash
# Install OpenAPI Generator
npm install @openapitools/openapi-generator-cli -g

# Generate Python client
openapi-generator-cli generate \
  -i http://localhost:8001/openapi.json \
  -g python \
  -o ./python-client

# Generate JavaScript client
openapi-generator-cli generate \
  -i http://localhost:8001/openapi.json \
  -g javascript \
  -o ./js-client
```

## 🛠️ Development Tools Integration

### VS Code REST Client

Create a `.http` file with API requests:

```http
### Health Check
GET http://localhost:8001/health

### Model Information
GET http://localhost:8001/model/info

### Predict from file
POST http://localhost:8001/predict/file
Content-Type: multipart/form-data; boundary=boundary

--boundary
Content-Disposition: form-data; name="image"; filename="eye_image.jpg"
Content-Type: image/jpeg

< ./path/to/eye_image.jpg
--boundary--
```

### Insomnia

Import the OpenAPI schema:
1. Open Insomnia
2. Click "Create" → "Import from URL"
3. Enter: `http://localhost:8001/openapi.json`
4. Import all endpoints automatically

### HTTPie

```bash
# Health check
http GET localhost:8001/health

# Model info with pretty formatting
http GET localhost:8001/model/info | jq

# File upload prediction
http --form POST localhost:8001/predict/file image@eye_image.jpg
```

## 📱 Mobile-Friendly Documentation

Both Swagger UI and ReDoc are responsive and work well on mobile devices:

- **Tablet/Mobile**: Full functionality with touch-friendly interface
- **Offline**: Cache documentation for offline viewing
- **Print**: Print-friendly versions available

## 🔍 Search and Navigation

### Swagger UI Navigation
- **Tags**: Endpoints grouped by functionality
- **Search**: Filter endpoints by name or description
- **Models**: View all data schemas in one place
- **History**: Track your testing history

### ReDoc Navigation
- **Sidebar**: Quick navigation to any section
- **Search**: Full-text search across documentation
- **Anchor Links**: Deep links to specific endpoints
- **Table of Contents**: Overview of all endpoints

## 🎯 Best Practices

### For Developers
1. **Start with ReDoc** for comprehensive overview
2. **Use Swagger UI** for interactive testing
3. **Download OpenAPI schema** for client generation
4. **Bookmark documentation** for quick access

### For Integration
1. **Test in Swagger UI** before implementing
2. **Generate client code** from OpenAPI schema
3. **Import to Postman/Insomnia** for team collaboration
4. **Use schema validation** in your applications

### For Documentation
1. **Share ReDoc links** with stakeholders
2. **Use Swagger UI** for live demonstrations
3. **Export OpenAPI schema** for external documentation
4. **Screenshot examples** for tutorials

## 🚀 Performance

| Interface | Load Time | Features | Best For |
|-----------|-----------|----------|-----------|
| **Swagger UI** | ~2s | Interactive testing | Development |
| **ReDoc** | ~1s | Beautiful docs | Reading |
| **OpenAPI JSON** | ~100ms | Machine readable | Automation |

## 📞 Support

If you encounter issues with the documentation:

1. **Check API health**: `GET /health`
2. **Verify endpoint**: Ensure API is running on correct port
3. **Browser cache**: Clear cache and refresh
4. **CORS issues**: Check browser console for errors
5. **Report bugs**: Submit issues via GitHub

## 🔗 Related Resources

- [API Endpoint Documentation](./README.md)
- [Development Setup Guide](../development/setup.md)
- [API Testing Guide](../development/api-testing.md)
- [Client Integration Examples](../development/client-integration.md)
