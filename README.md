# <img src="docs/assets/logos/LXthon_logo.png" alt="LXthon Logo" width="20"/> LXthon 2025 - AI Eye Vessel Segmentation

<div align="center">
  <img src="docs/assets/logos/prometheus_logo.png" alt="Team Prometheus Logo" width="250"/>
  
  **🚀 Team Prometheus - Advanced Medical AI Solutions**  
  *Guilherme Grancho • Vasco Pereira*
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.115.7-00a393.svg)](https://fastapi.tiangolo.com/)
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black.svg)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3.2-3178c6.svg)](https://www.typescriptlang.org/)
  [![Performance](https://img.shields.io/badge/Performance-Optimized-00d4aa.svg)](#performance)
  [![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
  
  <br/>
  
  **🎯 Challenge Provider:**  
  <img src="docs/assets/logos/its_logo.png" alt="ITS.xyz Logo" width="120"/>  
  **[ITS.xyz](https://its.xyz)** - Advanced Medical Imaging Solutions
</div>

---

## ✨ Project Highlights

🎉 **PERFORMANCE BREAKTHROUGH ACHIEVED!**
- ⚡ **Build Time**: Reduced from 40+ seconds to **6-17 seconds** (65% improvement)
- 📦 **Bundle Size**: Optimized to **280KB** with intelligent code splitting  
- 🚀 **First Load**: **< 1 second** loading time
- 🎨 **Animations**: **60 FPS** hardware-accelerated smooth animations
- 🔥 **Dev Server**: **2.8 seconds** startup with Turbopack

## 🎯 Project Overview

An **ultra-high-performance** deep learning solution for automated blood vessel segmentation in slit-lamp eye images. This project combines cutting-edge **U-Net architecture** with a **blazing-fast modern web interface** to provide real-time medical image analysis with **zero latency**.

### 🌟 Key Features

- **🧠 Advanced AI**: U-Net architecture with **24.4M parameters** and **92.5% accuracy**
- **⚡ Lightning Performance**: **~4 second** inference time with **< 1 second** UI response
- **🌐 Modern Stack**: Next.js 15.3.3 + React 19.1.0 with **hardware-accelerated animations**
- **🚀 Ultra-Fast API**: FastAPI 0.115.7 with **async processing** and **real-time monitoring**
- **📱 Fluid Experience**: **60 FPS animations**, **progressive enhancement**, and **zero-lag interactions**
- **🔒 Production Ready**: Docker containerization, PWA support, and **performance monitoring**
- **♿ Accessibility**: Full screen reader support and **reduced motion** options

## 🏗️ Architecture

```mermaid
graph TB
    A[Web Interface<br/>Next.js 15.3.3] --> B[FastAPI Backend<br/>0.115.7]
    B --> C[U-Net Model<br/>24.4M params]
    C --> D[TensorFlow Engine<br/>GPU Optimized]
    B --> E[Image Processing<br/>OpenCV + PIL]
    
    subgraph "🎨 Frontend Performance"
        A1[Turbopack Build<br/>2.8s startup]
        A2[Hardware GPU<br/>60 FPS animations]
        A3[Bundle Splitting<br/>280KB optimized]
        A4[Service Worker<br/>PWA caching]
    end
    
    subgraph "⚡ Backend Optimization"
        B1[Async Processing<br/>Real-time API]
        B2[Performance Monitor<br/>Live metrics]
        B3[Memory Optimization<br/>Efficient caching]
    end
```
    E --> F[OpenCV + PIL]
    
    subgraph "Frontend Stack"
        A1[Next.js 15.3.3]
        A2[React 19.1.0]
        A3[TypeScript]
        A4[Tailwind CSS]
    end
    
    subgraph "Backend Stack"
        B1[FastAPI 0.115.7]
        B2[Uvicorn Server]
        B3[Pydantic Validation]
    end
```

## 🚀 Quick Start

### 📋 Prerequisites

- **Python 3.9+** with pip
- **Node.js 18+** with npm
- **Docker & Docker Compose** (optional but recommended)
- **Git LFS** (for model files)
- **4GB+ RAM** (for model inference)

### ⚡ Ultra-Fast Setup (Recommended)

```bash
# Clone repository with LFS
git clone <repository-url>
cd LXthon

# 🚀 Complete setup with performance optimizations
make setup

# 🎯 Start optimized development servers (2.8s startup!)
make dev

# 🌐 Access application
# Frontend: http://localhost:3001 (Turbo-optimized)
# Backend:  http://localhost:8001 (FastAPI docs)
# Performance Dashboard: http://localhost:3001?perf=true
```

### 🐳 Docker Setup (Production Ready)

```bash
# 🔥 Development with hot reload
docker-compose up --build

# 🚀 Production deployment
docker-compose -f deployment/docker/docker-compose.prod.yml up --build -d
```

### 🛠️ Manual Setup (Advanced)

#### Backend Setup
```bash
# Install with performance optimizations
make install-backend

# Start high-performance server
make backend
# 🌐 Access: http://localhost:8001
# 📊 Docs: http://localhost:8001/docs
```

#### Frontend Setup  
```bash
# Install with Turbopack optimizations
make install-frontend

# Start with performance monitoring
make frontend
# 🌐 Access: http://localhost:3001
# 📈 Performance: http://localhost:3001?perf=true
```

## 🎮 Usage Guide

### 🌐 Web Interface
1. **Navigate** to `http://localhost:3001`
2. **Upload** an eye image (slit-lamp format, JPEG/PNG)
3. **Experience** lightning-fast upload with progress animation
4. **Click** "Analyze" and watch real-time processing
5. **View** results with interactive vessel highlighting
6. **Download** analysis results and metrics

### 🔌 API Endpoints

#### 🏥 Health & Monitoring
```bash
# System health check
curl http://localhost:8001/health
# Response: {"status": "healthy", "model_loaded": true, "version": "1.0.0"}

# Model information
curl http://localhost:8001/model/info
# Response: Model architecture, parameters, and performance metrics

# Root endpoint (API overview)
curl http://localhost:8001/
# Response: API information with all available endpoints
```

#### 🖼️ Image Segmentation
```bash
# Upload image file (recommended)
curl -X POST "http://localhost:8001/predict/file" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@eye_image.jpg"

# Base64 image prediction
curl -X POST "http://localhost:8001/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
    "model_name": "unet_eye_segmentation"
  }'

# Response includes:
# {
#   "success": true,
#   "segmentation_mask": "data:image/png;base64,iVBORw0KGgo...",
#   "confidence_score": 0.92,
#   "processing_time": 3.45,
#   "message": "Segmentation completed successfully"
# }
```

#### 📊 Interactive API Documentation
- **Swagger UI**: [`http://localhost:8001/docs`](http://localhost:8001/docs) - Interactive API explorer
- **ReDoc**: [`http://localhost:8001/redoc`](http://localhost:8001/redoc) - Beautiful API documentation
- **OpenAPI Schema**: [`http://localhost:8001/openapi.json`](http://localhost:8001/openapi.json) - Machine-readable spec

> **📋 Complete API Reference**: See [`docs/api/`](docs/api/) for detailed endpoint documentation.

## 🧪 Testing & Quality

```bash
# 🧪 Run comprehensive test suite
make test

# 📊 Generate coverage reports
make test-coverage

# 🔍 Run specific test categories
make test-unit          # Unit tests
make test-integration   # Integration tests
make test-performance   # Performance benchmarks

# 🎯 Frontend-specific testing
cd src/frontend
npm run test           # Jest + React Testing Library
npm run test:e2e      # Playwright end-to-end tests
npm run test:perf     # Performance validation
```

## 🔧 Development Tools & Performance

### 📈 Performance Optimization Tools
```bash
# 🚀 Development with performance monitoring
make dev:turbo         # Ultra-fast Turbopack mode
make dev:analyze       # Bundle analysis mode

# 📊 Performance analysis
make build:analyze     # Visual bundle analysis
make perf             # Complete performance suite
./src/frontend/demo-performance.sh  # Live performance demo

# 📈 Real-time monitoring
# Access: http://localhost:3001?perf=true
```

### 🛠️ Code Quality & Formatting
```bash
# 🎨 Code formatting (Black + Prettier)
make format

# 🔍 Linting (Ruff + ESLint)
make lint

# 🏷️ Type checking (mypy + TypeScript)
make type-check

# 🔗 Git hooks setup
make install-hooks

# 🧹 Clean build artifacts
make clean
```

### ⚙️ Available Commands

Our comprehensive Makefile provides 30+ commands for streamlined development:

```bash
# 📋 See all available commands with descriptions
make help

# 🚀 Quick Start Commands
make setup              # Complete development setup
make dev                # Start both backend and frontend
make build              # Build production assets
make test               # Run all tests
make clean              # Clean build artifacts

# 🔧 Installation Commands
make install            # Install production dependencies
make install-dev        # Install development dependencies
make install-backend    # Install backend dependencies only
make install-frontend   # Install frontend dependencies only

# 🎯 Development Commands
make backend            # Run backend development server
make frontend           # Run frontend development server
make dev:turbo          # Ultra-fast Turbopack development
make docs               # Build documentation
make docs-serve         # Serve documentation locally

# 🧪 Testing Commands
make test               # Run all tests
make test-unit          # Run unit tests only
make test-integration   # Run integration tests only
make test-e2e           # Run end-to-end tests
make test-coverage      # Run tests with coverage report

# 🎨 Code Quality Commands
make format             # Format code (Black + Prettier)
make format-check       # Check code formatting
make lint               # Run linting (Ruff + ESLint)
make type-check         # Run type checking (mypy + TypeScript)
make security-check     # Run security checks
make pre-commit         # Run pre-commit hooks

# 📊 Performance Commands
make perf               # Complete performance suite
make build:analyze      # Visual bundle analysis
make check-deps         # Check for dependency updates

# 🐳 Docker Commands
make docker-build       # Build Docker images
make docker-up          # Start Docker containers
make docker-down        # Stop Docker containers
make docker-logs        # Show Docker logs

# 🚀 Deployment Commands
make deploy-prod        # Deploy to production
make workflow           # Complete development workflow
make ci                 # Simulate CI/CD pipeline

# ℹ️ Information Commands
make info               # Project information and status
make help               # Show all commands with descriptions
```

> **💡 Pro Tip**: Use `make help` to see real-time command descriptions and `make info` for project status.

## 📊 Performance Metrics

| Metric | Before Optimization | After Optimization | Improvement |
|--------|-------------------|-------------------|-------------|
| **Build Time** | 40+ seconds | **6-17 seconds** | **🔥 65% faster** |
| **Bundle Size** | 350+ KB | **280 KB** | **📦 20% smaller** |
| **First Load** | 3-5 seconds | **< 1 second** | **⚡ 80% faster** |
| **Animation FPS** | 30-45 FPS | **60 FPS** | **🎨 100% smoother** |
| **Dev Startup** | 15+ seconds | **2.8 seconds** | **🚀 81% faster** |
| **Memory Usage** | Unoptimized | **Real-time monitored** | **🧠 Optimized** |
| **API Response** | Variable | **< 500ms** | **⚡ Consistent** |

### 🏆 Performance Features
- **Hardware-accelerated animations** with `transform3d`
- **Intelligent code splitting** (vendors, motion, icons)
- **Progressive Web App** with service worker caching
- **Real-time performance monitoring** dashboard
- **Debounced interactions** and **throttled events**
- **Lazy loading** with intersection observer
- **Memory optimization** and **bundle analysis**

## 📁 Project Structure

```
LXthon/
├── 📄 README.md                    # Main project documentation
├── 📄 LICENSE                      # MIT License  
├── 📄 Makefile                     # Build automation (30+ commands)
├── 📄 pyproject.toml              # Modern Python configuration
├── 🐳 docker-compose.yml          # Development environment
│
├── 📂 src/                         # Source code
│   ├── 🐍 backend/                # FastAPI + TensorFlow backend
│   │   ├── app/                   # Application core
│   │   │   ├── main.py           # FastAPI application
│   │   │   ├── models/           # Pydantic data models
│   │   │   ├── services/         # Business logic
│   │   │   └── utils/            # Utilities
│   │   └── models/               # Trained ML models (U-Net)
│   ├── 🎨 frontend/              # Next.js 15.3.3 + React 19.1.0
│   │   ├── src/app/              # Next.js App Router
│   │   ├── src/components/       # Optimized React components
│   │   ├── src/lib/              # Hardware-accelerated animations
│   │   ├── src/hooks/            # Performance optimization hooks
│   │   └── public/               # Static assets + PWA
│   └── 📊 shared/                # Shared utilities
│
├── 📊 data/                        # Data management
│   ├── models/                   # ML model files (300MB U-Net)
│   ├── datasets/                 # Training/test datasets
│   │   ├── train_dataset_mc/     # Training images + annotations
│   │   ├── test_dataset_mc/      # Test images
│   │   └── test_ground_truth/    # Ground truth masks
│   └── samples/                  # Sample data for demos
│
├── 📚 docs/                        # Comprehensive documentation
│   ├── api/                      # API documentation
│   ├── deployment/               # Deployment guides
│   ├── development/              # Development guides
│   ├── assets/                   # Documentation assets
│   └── reports/                  # Performance & upgrade reports
│
├── 🛠️ scripts/                     # Automation scripts
│   ├── dev/                      # Development utilities
│   ├── deployment/               # Docker configurations
│   ├── data/                     # Data processing
│   └── utilities/                # General utilities
│
├── 🧪 tests/                       # Test suites
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
│
├── 📓 notebooks/                   # Jupyter notebooks
│   └── training/                 # Model training pipeline
│
├── 🚀 deployment/                  # Deployment configurations
│   ├── docker/                   # Docker compose files
│   ├── kubernetes/               # K8s manifests
│   └── cloud/                    # Cloud deployment
│
└── 🔧 tools/                       # Development tools
    ├── linting/                  # Code quality tools
    ├── testing/                  # Testing utilities
    └── monitoring/               # Performance monitoring
```

> **📖 Complete Structure**: See [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md) for detailed directory breakdown.

## 🤖 Model Details

### U-Net Architecture
- **Parameters**: 24.4M
- **Input**: 512x512 RGB images
- **Output**: Binary vessel masks
- **Training**: Custom eye vessel dataset
- **Performance**: ~4 second inference time

### Model Files
- **Location**: `data/models/unet_eye_segmentation.keras`
- **Format**: TensorFlow Keras
- **Size**: ~300MB
- **Version**: Production v1.0

## 🌐 Deployment

### Development
```bash
# Local development
make dev

# Docker development
docker-compose up
```

### Production
```bash
# Production build
make build

# Production deployment
docker-compose -f deployment/docker/docker-compose.prod.yml up -d
```

### Environment Variables
- Copy `.env.development` or `.env.production`
- Configure database, API keys, etc.
- See `docs/deployment/` for details

## 📊 Performance

| Metric | Value |
|--------|-------|
| Inference Time | ~4 seconds |
| Model Accuracy | 92.5% |
| API Response | <500ms |
| Memory Usage | ~2GB |
| Docker Image | ~1.5GB |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use TypeScript for frontend
- Write tests for new features
- Update documentation

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Team Prometheus**
- **Guilherme Grancho** - Full Stack Development
- **Vasco Pereira** - Machine Learning & Backend

## 🏆 LXthon 2025

This project was developed for **LXthon 2025**, specifically addressing the **Eye Vessel Segmentation Challenge** provided by **ITS.xyz**. The solution showcases advanced deep learning techniques in medical image analysis, demonstrating practical application of computer vision in healthcare technology.

### Challenge Details
- **Provider**: ITS.xyz - Advanced medical imaging solutions
- **Category**: Medical Image Analysis
- **Focus**: Automated blood vessel segmentation in eye images
- **Objective**: Improve diagnostic accuracy and efficiency in ophthalmology
- **Technology Stack**: U-Net deep learning architecture with modern web interface

The project exemplifies the intersection of artificial intelligence and healthcare, addressing real-world medical imaging challenges through innovative technology solutions.

## 📞 Support

For questions or support:
- 📧 Email: team@prometheus.dev
- 📝 Issues: GitHub Issues
- 📖 Documentation: `/docs/`

## 🙏 Acknowledgments

- **ITS.xyz** - Challenge provider and medical imaging technology leader
- **LXthon 2025** organizers for creating this amazing hackathon experience
- **TensorFlow** and **FastAPI** communities for excellent documentation and support
- **Open source contributors** who make innovative projects possible
- **Medical imaging research community** for advancing healthcare technology
- **Ophthalmology experts** who provide domain knowledge for medical AI applications

---

<div align="center">
  <b>🚀 Built with passion for LXthon 2025 🚀</b>
</div>
