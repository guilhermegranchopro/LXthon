# 🔧 Development Setup Guide

Complete development environment setup for the Eye Vessel Segmentation project.

## 📋 System Requirements

### Minimum Requirements
- **OS**: Linux, macOS, or Windows 10+
- **Python**: 3.9 or higher
- **Node.js**: 18.0 or higher
- **RAM**: 4GB (8GB recommended)
- **Storage**: 2GB free space
- **GPU**: Optional (NVIDIA with CUDA for faster inference)

### Recommended Development Tools
- **IDE**: VS Code, PyCharm, or WebStorm
- **Terminal**: iTerm2, Windows Terminal, or built-in terminal
- **Git**: Latest version with Git LFS
- **Docker**: Docker Desktop (optional but recommended)

## 🔍 Environment Validation

Run this comprehensive check before setup:

```bash
# System information
uname -a

# Python validation
python3 --version
python3 -c "import sys; print(f'Python executable: {sys.executable}')"
python3 -c "import pip; print(f'Pip version: {pip.__version__}')"

# Node.js validation
node --version
npm --version
npx --version

# Git validation
git --version
git lfs version

# Optional: Docker validation
docker --version
docker-compose --version

# Optional: GPU validation (if available)
nvidia-smi  # For NVIDIA GPUs
```

## 🛠️ Development Environment Setup

### 1. Repository Setup

```bash
# Clone repository with LFS support
git clone <repository-url>
cd LXthon

# Initialize Git LFS (for model files)
git lfs install
git lfs pull

# Verify large files
git lfs ls-files
```

### 2. Python Environment Setup

#### Option A: Using Virtual Environment (Recommended)

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Install project dependencies
pip install -e ".[dev,backend,ml,docs]"

# Verify installation
pip list | grep -E "(fastapi|tensorflow|uvicorn)"
```

#### Option B: Using uv (Modern Python Package Manager)

```bash
# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create and activate environment
uv venv
source .venv/bin/activate  # Linux/macOS
# or
.venv\Scripts\activate     # Windows

# Install dependencies
uv pip install -e ".[dev,backend,ml,docs]"
```

### 3. Node.js Environment Setup

```bash
# Navigate to frontend directory
cd src/frontend

# Install dependencies with performance optimizations
npm install

# Verify Next.js installation
npx next --version

# Optional: Install global development tools
npm install -g @next/bundle-analyzer
npm install -g lighthouse
```

### 4. Development Tools Setup

#### Code Quality Tools

```bash
# Install pre-commit hooks
pre-commit install

# Install additional linting tools
pip install black isort mypy ruff bandit safety

# Configure VS Code (if using)
code --install-extension ms-python.python
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
```

#### Performance Tools

```bash
# Frontend performance tools
cd src/frontend
npm install --save-dev @next/bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# Backend performance tools
pip install memory-profiler py-spy
```

## ⚙️ Configuration Setup

### 1. Environment Variables

Create environment configuration files:

```bash
# Copy example environment files
cp .env.example .env.development
cp .env.example .env.production

# Edit development configuration
nano .env.development
```

#### Development Environment Variables

```bash
# .env.development
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8001
API_HOST=0.0.0.0
API_PORT=8001
MODEL_PATH=./models/unet_eye_segmentation.keras
LOG_LEVEL=DEBUG
CORS_ORIGINS=["http://localhost:3001", "http://127.0.0.1:3001"]
```

### 2. IDE Configuration

#### VS Code Setup

Create `.vscode/settings.json`:

```json
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": false,
  "python.linting.flake8Enabled": false,
  "python.linting.ruffEnabled": true,
  "python.formatting.provider": "black",
  "python.sortImports.provider": "isort",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "files.associations": {
    "*.md": "markdown"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "eslint.workingDirectories": ["src/frontend"]
}
```

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Backend Debug",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/src/backend/app/main.py",
      "console": "integratedTerminal",
      "env": {
        "PYTHONPATH": "${workspaceFolder}/src/backend"
      }
    },
    {
      "name": "Frontend Debug",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/src/frontend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"]
    }
  ]
}
```

## 🚀 Development Servers

### Start Development Environment

#### Option 1: Automated (Recommended)

```bash
# Start both backend and frontend
make dev

# Or use specific commands
make backend    # Backend only
make frontend   # Frontend only
```

#### Option 2: Manual

**Backend Server:**

```bash
# Activate Python environment
source venv/bin/activate

# Navigate to backend
cd src/backend

# Start development server with hot reload
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload --log-level debug

# Alternative: Use make command
make backend
```

**Frontend Server:**

```bash
# Navigate to frontend (new terminal)
cd src/frontend

# Start development server
npm run dev

# Alternative: Use make command
make frontend
```

### Development URLs

After starting servers:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs
- **API ReDoc**: http://localhost:8001/redoc
- **Performance Dashboard**: http://localhost:3001?perf=true

## 🧪 Testing Setup

### Backend Testing

```bash
# Install test dependencies
pip install pytest pytest-cov pytest-asyncio httpx

# Run tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=src/backend --cov-report=html

# Test specific categories
pytest tests/unit/ -v           # Unit tests
pytest tests/integration/ -v    # Integration tests
```

### Frontend Testing

```bash
cd src/frontend

# Install test dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Run with coverage
npm run test:coverage

# End-to-end tests
npm run test:e2e
```

## 📊 Performance Optimization

### Backend Performance

```bash
# Profile memory usage
python -m memory_profiler src/backend/app/main.py

# Profile CPU usage
py-spy top --pid <backend-pid>

# Benchmark API
pip install locust
locust -f tests/performance/locustfile.py
```

### Frontend Performance

```bash
cd src/frontend

# Bundle analysis
npm run analyze

# Performance audit
npx lighthouse http://localhost:3001 --view

# Build performance
npm run build -- --profile
```

## 🔍 Debugging Setup

### Backend Debugging

```bash
# Debug mode with verbose logging
export LOG_LEVEL=DEBUG
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload --log-level debug

# Memory debugging
python -m memory_profiler -m uvicorn app.main:app --host 0.0.0.0 --port 8001

# Step-by-step debugging
python -m pdb -m uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### Frontend Debugging

```bash
cd src/frontend

# Debug mode
npm run dev -- --debug

# Inspect Next.js build
npm run build -- --debug

# Analyze bundle
npm run analyze
```

## 🔧 Maintenance Commands

### Regular Maintenance

```bash
# Update dependencies
make check-deps

# Security audit
make security-check

# Code formatting
make format

# Linting
make lint

# Type checking
make type-check

# Clean build artifacts
make clean
```

### Database/Model Management

```bash
# Check model status
curl http://localhost:8001/model/info

# Retrain model (if needed)
make train

# Create demo data
python scripts/data/create_demo.py
```

## 🐛 Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Find process using port
lsof -i :8001  # Backend
lsof -i :3001  # Frontend

# Kill process
kill -9 <PID>

# Use alternative ports
uvicorn app.main:app --port 8002
npm run dev -- --port 3002
```

#### Model Loading Issues
```bash
# Check model file
ls -la data/models/unet_eye_segmentation.keras

# Test model loading
python -c "
import tensorflow as tf
model = tf.keras.models.load_model('data/models/unet_eye_segmentation.keras')
print('Model loaded successfully')
print(f'Model input shape: {model.input_shape}')
"
```

#### Memory Issues
```bash
# Monitor memory usage
free -h  # Linux
vm_stat  # macOS

# Reduce memory usage
export TF_CPP_MIN_LOG_LEVEL=2  # Reduce TensorFlow logging
export CUDA_VISIBLE_DEVICES=""  # Disable GPU if needed
```

## 📚 Learning Resources

### Documentation
- [API Documentation](../api/README.md)
- [Architecture Guide](../architecture/system-overview.md)
- [Deployment Guide](../deployment/README.md)

### External Resources
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TensorFlow Documentation](https://www.tensorflow.org/)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Code Quality Workflow

```bash
# Before committing
make format      # Format code
make lint        # Check linting
make type-check  # Type checking
make test        # Run tests
make security-check  # Security audit
```

### Performance Workflow

```bash
# Performance testing
make perf        # Run performance suite
make build:analyze  # Analyze bundle
```

## 📞 Getting Help

If you encounter issues:

1. **Check logs**: Look at terminal output for error messages
2. **Verify requirements**: Ensure all prerequisites are met
3. **Clean install**: Try `make clean-all && make setup`
4. **Check documentation**: Review relevant guides in `docs/`
5. **GitHub Issues**: Search existing issues or create new one
6. **Community**: Join project discussions

---

<div align="center">
  <b>🚀 Happy Developing! 🚀</b>
</div>
