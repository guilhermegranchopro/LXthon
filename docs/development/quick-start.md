# 🚀 Quick Start Guide

Get up and running with the Eye Vessel Segmentation API in under 5 minutes.

## ⚡ Prerequisites Check

Before starting, ensure you have:

```bash
# Check Python version (3.9+ required)
python3 --version

# Check Node.js version (18+ required)
node --version

# Check npm version
npm --version

# Check Docker (optional but recommended)
docker --version
docker-compose --version
```

## 🎯 Option 1: Ultra-Fast Setup (Recommended)

Use our automated Makefile for the fastest setup:

```bash
# Clone and enter repository
git clone <repository-url>
cd LXthon

# 🚀 Complete setup (installs everything)
make setup

# 🎯 Start development servers
make dev

# 🌐 Access applications
# Frontend: http://localhost:3001
# Backend API: http://localhost:8001
# API Docs: http://localhost:8001/docs
```

**Expected time**: 2-3 minutes

## 🐳 Option 2: Docker Setup (Zero Dependencies)

Perfect if you want isolated environment:

```bash
# Clone repository
git clone <repository-url>
cd LXthon

# 🔥 Start with Docker (downloads everything automatically)
docker-compose up --build

# 🌐 Access applications
# Frontend: http://localhost:3001
# Backend API: http://localhost:8001
```

**Expected time**: 3-5 minutes (depends on download speed)

## 🛠️ Option 3: Manual Setup (Advanced)

For developers who want full control:

### Backend Setup

```bash
# Navigate to backend
cd src/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Linux/Mac
# or
# venv\Scripts\activate   # On Windows

# Install dependencies
pip install -r requirements.txt

# Start backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Setup

```bash
# Navigate to frontend (in new terminal)
cd src/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected time**: 5-10 minutes

## ✅ Verification Steps

After setup, verify everything works:

### 1. Check Backend Health
```bash
curl http://localhost:8001/health
# Should return: {"status": "healthy", "model_loaded": true, "version": "1.0.0"}
```

### 2. Check Frontend
- Open http://localhost:3001
- Should see Eye Vessel Segmentation interface
- Upload functionality should be available

### 3. Test API Documentation
- Open http://localhost:8001/docs
- Should see Swagger UI with all endpoints

### 4. Test Prediction (Optional)
```bash
# Test with sample image (if available)
curl -X POST "http://localhost:8001/predict/file" \
  -F "image=@data/samples/sample_eye.jpg"
```

## 🔧 Common Issues & Solutions

### Port Already in Use
```bash
# Check what's using the ports
lsof -i :3001  # Frontend port
lsof -i :8001  # Backend port

# Kill process if needed
kill -9 <PID>

# Or use different ports
make frontend PORT=3002
make backend PORT=8002
```

### Model Not Loading
```bash
# Check if model file exists
ls -la data/models/unet_eye_segmentation.keras

# If missing, download or train model
make train  # Train new model (takes time)
# or
# Download pre-trained model from releases
```

### Python Dependencies Issues
```bash
# Upgrade pip first
pip install --upgrade pip

# Install with verbose output
pip install -v -r src/backend/requirements.txt

# Try with system Python if virtual env fails
python3 -m pip install --user -r src/backend/requirements.txt
```

### Node.js Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
cd src/frontend
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues
```bash
# Clean Docker system
docker system prune -f

# Rebuild without cache
docker-compose build --no-cache

# Check logs
docker-compose logs backend
docker-compose logs frontend
```

## 🎮 First API Call

Make your first prediction:

### Using cURL
```bash
# Health check first
curl http://localhost:8001/health

# Make prediction (replace with your image path)
curl -X POST "http://localhost:8001/predict/file" \
  -F "image=@path/to/your/eye_image.jpg" \
  -o prediction_result.json

# View result
cat prediction_result.json | jq '.'
```

### Using Python
```python
import requests

# Health check
response = requests.get("http://localhost:8001/health")
print("Health:", response.json())

# Make prediction
with open("path/to/eye_image.jpg", "rb") as f:
    files = {"image": f}
    response = requests.post("http://localhost:8001/predict/file", files=files)
    result = response.json()
    print("Success:", result["success"])
    print("Confidence:", result["confidence_score"])
```

### Using Web Interface
1. Go to http://localhost:3001
2. Click "Choose File" or drag and drop an eye image
3. Click "Analyze"
4. Wait for results (3-5 seconds)
5. View segmentation overlay

## 📈 Performance Monitoring

Enable performance monitoring:

```bash
# Access performance dashboard
open http://localhost:3001?perf=true

# Run performance demo
./src/frontend/demo-performance.sh

# Check bundle analysis
make build:analyze
```

## 🧪 Run Tests

Verify everything works with tests:

```bash
# Run all tests
make test

# Run specific test categories
make test-unit          # Fast unit tests
make test-integration   # API integration tests
make test-e2e          # End-to-end tests

# Test coverage
make test-coverage
```

## 📚 Next Steps

Now that you're set up:

1. **📖 Read Documentation**: Check [`docs/`](../README.md) for detailed guides
2. **🔌 Explore API**: Try [`http://localhost:8001/docs`](http://localhost:8001/docs)
3. **⚡ Performance**: Learn about [performance optimizations](../reports/NEXTJS_PERFORMANCE_OPTIMIZATION_COMPLETE.md)
4. **🚀 Deploy**: See [deployment guide](../deployment/README.md)
5. **🤝 Contribute**: Read [contributing guidelines](../../README.md#contributing)

## 💡 Development Tips

### Useful Commands
```bash
# See all available commands
make help

# Get project information
make info

# Clean everything and start fresh
make clean-all
make setup

# Format code
make format

# Check code quality
make lint
```

### Performance Commands
```bash
# Ultra-fast development with Turbopack
make dev:turbo

# Performance analysis
make perf

# Bundle analysis
make build:analyze
```

### Hot Reloading
- **Backend**: Automatic reload on code changes (uvicorn --reload)
- **Frontend**: Hot module replacement with Next.js
- **Styles**: Instant Tailwind CSS updates

## 📞 Need Help?

- **📚 Documentation**: [`docs/README.md`](../README.md)
- **🔌 API Reference**: [`docs/api/README.md`](../api/README.md)
- **🐛 Issues**: GitHub Issues
- **💬 Discussions**: GitHub Discussions
- **📧 Contact**: team@prometheus.dev

---

<div align="center">
  <b>🎉 You're ready to start building! 🎉</b>
</div>
