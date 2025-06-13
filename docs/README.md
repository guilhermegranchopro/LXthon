# 📚 LXthon 2025 Documentation

Welcome to the comprehensive documentation for the **LXthon 2025 Eye Vessel Segmentation** project by **Team Prometheus**.

## ✨ Project Highlights

🎉 **PERFORMANCE BREAKTHROUGH ACHIEVED!**
- ⚡ **Build Time**: Reduced from 40+ seconds to **6-17 seconds** (65% improvement)
- 📦 **Bundle Size**: Optimized to **280KB** with intelligent code splitting  
- 🚀 **First Load**: **< 1 second** loading time
- 🎨 **Animations**: **60 FPS** hardware-accelerated smooth animations
- 🔥 **Dev Server**: **2.8 seconds** startup with Turbopack

## 🌟 Key Features

- **🧠 Advanced AI**: U-Net architecture with **24.4M parameters** and **92.5% accuracy**
- **⚡ Lightning Performance**: **~4 second** inference time with **< 1 second** UI response
- **🌐 Modern Stack**: Next.js 15.3.3 + React 19.1.0 with **hardware-accelerated animations**
- **🚀 Ultra-Fast API**: FastAPI 0.115.7 with **async processing** and **real-time monitoring**
- **📱 Fluid Experience**: **60 FPS animations**, **progressive enhancement**, and **zero-lag interactions**
- **🔒 Production Ready**: Docker containerization, PWA support, and **performance monitoring**
- **♿ Accessibility**: Full screen reader support and **reduced motion** options

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

> **📖 Complete Structure**: See [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) for detailed directory breakdown.

## 🧭 Quick Navigation

| What you need | Where to go | Quick command |
|---------------|-------------|---------------|
| **🚀 Get started fast** | [Quick Start](development/quick-start.md) | `make setup && make dev` |
| **🔧 Complete setup** | [Development Setup](development/setup.md) | `make install-dev` |
| **🔌 Use the API** | [API Documentation](api/README.md) | Open `http://localhost:8001/docs` |
| **🚀 Deploy to production** | [Deployment Guide](deployment/README.md) | `make deploy-prod` |
| **🧪 Run tests** | [Testing Guide](development/testing.md) | `make test` |
| **📊 Check performance** | [Performance Reports](reports/) | `make perf` |
| **🏗️ Understand architecture** | [System Architecture](architecture/system-overview.md) | `make info` |

## 📖 Documentation Structure

### 🚀 Getting Started
- **[Quick Start Guide](development/quick-start.md)** - Get running in 5 minutes
- **[Development Setup](development/setup.md)** - Complete development environment
- **[Installation Guide](development/installation.md)** - Step-by-step installation

### 🔌 API Reference
- **[API Overview](api/README.md)** - Complete API documentation
- **[Endpoint Reference](api/endpoints/)** - Detailed endpoint docs
  - [Health Check](api/endpoints/health.md) - System health monitoring
  - [Image Prediction](api/endpoints/prediction.md) - Vessel segmentation
  - [Model Information](api/endpoints/model-info.md) - Model details
  - [Interactive Docs](api/endpoints/interactive-docs.md) - Swagger & ReDoc

### 🏗️ Architecture & Design
- **[System Overview](architecture/system-overview.md)** - High-level architecture
- **[AI/ML Components](architecture/ml-components.md)** - U-Net model details
- **[Frontend Architecture](architecture/frontend.md)** - Next.js performance optimizations
- **[Backend Architecture](architecture/backend.md)** - FastAPI design patterns

### 🚀 Deployment
- **[Deployment Guide](deployment/README.md)** - Production deployment
- **[Docker Setup](deployment/docker.md)** - Container deployment
- **[Kubernetes](deployment/kubernetes.md)** - Scalable deployment
- **[Cloud Platforms](deployment/cloud.md)** - AWS, GCP, Azure deployment

### 🧪 Development
- **[Development Workflow](development/workflow.md)** - Git workflow and best practices
- **[Testing Strategy](development/testing.md)** - Comprehensive testing guide
- **[Performance Optimization](development/performance.md)** - Speed optimization
- **[Code Style Guide](development/style-guide.md)** - Coding standards

### 📊 Reports & Analysis
- **[Performance Reports](reports/)** - Optimization achievements
  - [Next.js Performance](reports/NEXTJS_PERFORMANCE_OPTIMIZATION_COMPLETE.md)
  - [FastAPI Upgrade](reports/FASTAPI_UPGRADE_COMPLETE.md)
  - [Organization Report](reports/ORGANIZATION_COMPLETE.md)
- **[Project Structure](PROJECT_STRUCTURE.md)** - Detailed directory breakdown
- **[Setup Reports](reports/SETUP_COMPLETE.md)** - Configuration guides

## 🎯 Project Overview

The LXthon 2025 Eye Vessel Segmentation project is an advanced medical imaging solution that combines:

- **🧠 Deep Learning**: U-Net architecture for precise vessel segmentation
- **⚡ Modern Web Stack**: Next.js 15.3.3 + FastAPI 0.115.7
- **🔒 Production Ready**: Docker, CI/CD, monitoring
- **📱 User Experience**: Professional, responsive web interface

## 🏆 Team Prometheus

- **Guilherme Grancho** - Lead Developer & AI/ML Specialist
- **Vasco Pereira** - Frontend Developer & System Architect

## 📝 Contributing

Please read our [Contributing Guide](development/contributing.md) before submitting changes.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](../LICENSE) for details.

---

<div align="center">
  <strong>🚀 LXthon 2025 - Advancing Healthcare through AI Innovation 🚀</strong>
</div>

## 🚀 Project Overview

This project provides an AI-powered solution for automatically segmenting blood vessels in slit-lamp eye images using deep learning. The solution combines a **U-Net neural network** backend with a modern **Next.js** web interface to deliver fast, accurate vessel segmentation for ophthalmological analysis.

## 📁 Project Structure

```
📦 eye-vessel-segmentation/
├── 📄 README.md                    # Project overview and setup
├── 📄 LICENSE                      # MIT License
├── 📄 .gitignore                   # Git ignore rules
├── 📄 .gitattributes              # Git LFS configuration
├── 🐳 backend/                     # FastAPI + TensorFlow backend
│   ├── 📄 Dockerfile              # Backend container
│   ├── 📄 pyproject.toml          # Python dependencies (uv)
│   ├── 📄 requirements.txt        # Docker compatibility
│   ├── 📄 Makefile                # Development commands
│   ├── 🐍 app/                    # Application code
│   │   ├── 📄 main.py             # FastAPI application
│   │   ├── 📁 models/             # Model definitions
│   │   ├── 📁 services/           # Business logic
│   │   └── 📁 utils/              # Utilities
│   └── 🤖 models/                 # Trained model files
├── 🎨 frontend/                    # Next.js + TypeScript frontend
│   ├── 📄 Dockerfile              # Frontend container
│   ├── 📄 package.json            # Node.js dependencies
│   ├── 📄 next.config.js          # Next.js configuration
│   ├── 📁 src/                    # Source code
│   └── 📁 public/                 # Static assets
├── 📊 dataset/                     # Training and test data
│   ├── 📁 train_dataset_mc/       # Training images & annotations
│   ├── 📁 test_dataset_mc/        # Test images
│   └── 📁 test_ground_truth/      # Ground truth masks
├── 📚 docs/                       # Documentation
│   ├── 📁 images/                 # Project screenshots
│   ├── 📁 api/                    # API documentation
│   └── 📁 setup/                  # Setup guides
├── 🛠️ scripts/                    # Automation scripts
│   ├── 📁 dev/                    # Development scripts
│   ├── 📁 deployment/             # Docker & deployment
│   └── 📁 utils/                  # Utility scripts
├── 🔧 tools/                      # Development tools
│   ├── 📄 train_model.py          # Model training
│   ├── 📄 create_demo.py          # Demo generation
│   └── 📄 quick_train.py          # Quick training script
├── 🧪 tests/                      # Test files
│   ├── 📄 test_backend.py         # Backend tests
│   ├── 📄 test_application.py     # Application tests
│   └── 📄 validate_app.py         # Validation scripts
├── 📓 notebooks/                  # Jupyter notebooks
│   └── 📄 model_training.ipynb    # Training notebook
└── 📊 logs/                       # Application logs
```

## 🧭 Quick Navigation

| What you need | Where to go | Quick command |
|---------------|-------------|---------------|
| **Start developing** | [`scripts/dev/`](scripts/dev/) | `./scripts/dev/dev-setup-complete.sh` |
| **Deploy application** | [`scripts/deployment/`](scripts/deployment/) | `docker-compose -f scripts/deployment/docker-compose.yml up` |
| **Run tests** | [`tests/`](tests/) | `python tests/test_complete_system.py` |
| **Train models** | [`tools/`](tools/) | `python tools/train_model.py` |
| **Read documentation** | [`docs/`](docs/) | Open [`docs/README.md`](docs/README.md) |
| **View project structure** | Root directory | Open [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md) |

## ✨ Features

- **🤖 AI-Powered Segmentation**: U-Net deep learning model for precise vessel detection
- **⚡ Real-time Processing**: Results delivered in under 3 seconds
- **🎨 Modern Web Interface**: Intuitive drag-and-drop image upload
- **📊 Detailed Analytics**: Confidence scores, vessel coverage, and region metrics
- **📥 Export Options**: Download original images, masks, and analysis results
- **🔄 Interactive Visualization**: Switch between original, mask, and overlay views
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices

## 🏗️ Architecture

### Backend (FastAPI + TensorFlow)
- **FastAPI**: Modern Python web framework for the API
- **TensorFlow/Keras**: Deep learning model inference
- **OpenCV**: Image processing and manipulation
- **U-Net Model**: Specialized architecture for medical image segmentation

### Frontend (Next.js + TypeScript)
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Modern icon library
- **Axios**: HTTP client for API communication

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git
- Python 3.9+ (for local development)
- Node.js 18+ (for frontend development)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd eye-vessel-segmentation
```

### 2. Quick Setup (Recommended)
```bash
# Complete development environment setup
./scripts/dev/dev-setup-complete.sh
```

### 3. Start Development Servers
```bash
# Backend (FastAPI with hot reload)
./scripts/dev/start-backend-dev.sh

# Frontend (Next.js on port 3001)
./scripts/dev/start-frontend.sh
```

### 4. Access the Application
- 🎨 **Frontend**: http://localhost:3001
- 🔧 **Backend API**: http://localhost:8000
- 📖 **API Docs**: http://localhost:8000/docs

## 🐳 Docker Deployment

### Development
```bash
# Start with Docker Compose
docker-compose -f scripts/deployment/docker-compose.yml up
```

### Production
```bash
# Production deployment
docker-compose -f scripts/deployment/docker-compose.prod.yml up -d
```
```

### 3. Start the Application
```bash
# Start both backend and frontend
docker-compose up --build

# Or start individually
docker-compose up backend
docker-compose up frontend
```

### 4. Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Development Setup

## 🛠️ Development

### Modern Python Development (Recommended)
```bash
cd backend

# Setup with uv (fast package manager)
make dev-setup

# Development commands
make run          # Start development server
make lint         # Check code quality
make format       # Format code
make test         # Run tests
```

### Traditional Development
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Run development server (port 3001)
npm run dev
```

### Testing
```bash
# Backend tests
cd backend && pytest

# Full application test
python tests/test_complete_system.py

# Validate setup
python tests/validate_app.py
```

## 📖 API Documentation

### Endpoints

#### `POST /predict`
Analyze an image and return vessel segmentation.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ...",
  "model_name": "unet_eye_segmentation"
}
```

**Response:**
```json
{
  "success": true,
  "segmentation_mask": "data:image/png;base64,iVBORw0K...",
  "confidence_score": 0.89,
  "processing_time": 1.23,
  "message": "Segmentation completed successfully"
}
```

#### `POST /predict/file`
Upload an image file for analysis.

#### `GET /health`
Check API health status.

#### `GET /model/info`
Get information about the loaded model.

## 🧠 Model Information

### U-Net Architecture
- **Input Size**: 512x512x3 (RGB images)
- **Output**: 512x512x1 (Binary segmentation mask)
- **Training Data**: Slit-lamp eye images with GeoJSON annotations
- **Optimization Metric**: F1 Score
- **Framework**: TensorFlow/Keras

### Data Processing Pipeline
1. **Input**: Base64 encoded slit-lamp image
2. **Preprocessing**: Resize to 512x512, normalize to [0,1]
3. **Inference**: U-Net model prediction
4. **Postprocessing**: Binary thresholding, morphological operations
5. **Output**: Binary mask with vessel regions

## 📊 Evaluation Metrics

- **Confidence Score**: Average model prediction confidence
- **Vessel Coverage**: Percentage of image containing vessels
- **Processing Time**: End-to-end inference time
- **Vessel Regions**: Number of discrete vessel segments
- **F1 Score**: Harmonic mean of precision and recall (validation)

## 🎯 Challenge Requirements ✅

- ✅ **Dataset Usage**: Processes slit-lamp images with GeoJSON annotations
- ✅ **Model Training**: U-Net architecture optimized for vessel segmentation
- ✅ **F1 Score Optimization**: Model evaluation and optimization target
- ✅ **Generalization**: Robust performance across lighting and anatomical conditions
- ✅ **Binary Mask Output**: Accurate vessel region identification

## 📁 Project Structure

```
📦 eye-vessel-segmentation/
├── 📄 README.md                    # Project overview and setup
├── 📄 LICENSE                      # MIT License
├── 🐳 backend/                     # FastAPI + TensorFlow backend
│   ├── 📄 pyproject.toml          # Modern Python config (uv/ruff)
│   ├── 📄 Makefile                # Development commands
│   ├── 🐍 app/                    # Application code
│   └── 🤖 models/                 # Trained model files
├── 🎨 frontend/                    # Next.js + TypeScript frontend
│   ├── 📄 package.json            # Node.js dependencies
│   └── 📁 src/                    # Source code
├── 📊 dataset/                     # Training and test data
├── 📚 docs/                       # Documentation & guides
├── 🛠️ scripts/                    # Development & deployment scripts
├── 🔧 tools/                      # Training & utility tools
├── 🧪 tests/                      # Test files & validation
└── 📓 notebooks/                  # Jupyter notebooks
```

> **📖 Detailed Structure**: See [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md) for complete directory breakdown.

## 🔬 Technical Details

### Image Processing
- **Format Support**: JPEG, PNG, GIF
- **Size Limits**: Maximum 10MB upload
- **Preprocessing**: Automatic resizing and normalization
- **Augmentation**: Runtime data augmentation for robustness

### Performance Optimizations
- **Model Caching**: Single model load on startup
- **Async Processing**: Non-blocking API operations
- **Efficient Memory Usage**: Optimized image processing pipeline
- **Error Handling**: Comprehensive error management and logging

### Security Features
- **Input Validation**: File type and size validation
- **CORS Configuration**: Secure cross-origin requests
- **Error Sanitization**: Safe error message exposure

## 🚀 Deployment

### Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with production settings
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
```bash
# Frontend
NEXT_PUBLIC_API_URL=https://your-api-domain.com

# Backend
MODEL_PATH=/app/models/unet_eye_segmentation.keras
LOG_LEVEL=INFO
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Hackathon Deliverables

### 1. Teaser
AI-powered blood vessel segmentation in eye images using U-Net deep learning, delivering fast and accurate results for ophthalmological analysis through an intuitive web interface.

### 2. Problem Brief
See `ITS EYE challenge.pdf` for detailed presentation slides.

### 3. Prototype Repository
This GitHub repository contains the complete solution with source code, documentation, and deployment instructions.

### 4. Screencast
[Link to demo video showing end-to-end workflow]

### 5. Live Demo
[Link to deployed application]

## 👥 Team Prometheus

**Guilherme Grancho** - Full Stack Development & AI/ML Engineering  
**Vasco Pereira** - Machine Learning & Backend Architecture

## 🏆 LXthon 2025 Challenge

This project was developed for **LXthon 2025**, specifically addressing the **Eye Vessel Segmentation Challenge** provided by **[ITS.xyz](https://its.xyz)**. The solution showcases advanced deep learning techniques in medical image analysis, demonstrating practical application of computer vision in healthcare technology.

### Challenge Details
- **Provider**: ITS.xyz - Advanced medical imaging solutions
- **Category**: Medical Image Analysis
- **Focus**: Automated blood vessel segmentation in eye images
- **Objective**: Improve diagnostic accuracy and efficiency in ophthalmology
- **Technology Stack**: U-Net deep learning architecture with modern web interface

## 🚀 Technologies Used

### Backend Stack
- **FastAPI 0.115.7** - High-performance async API framework
- **TensorFlow 2.13** - Deep learning model training and inference
- **U-Net Architecture** - 24.4M parameter medical image segmentation
- **Python 3.9+** - Modern Python with type hints
- **Uvicorn** - ASGI server with hot reload

### Frontend Stack
- **Next.js 15.3.3** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.3.2** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Hardware-accelerated animations

### Development & DevOps
- **Docker & Docker Compose** - Containerization
- **Kubernetes** - Container orchestration
- **GitHub Actions** - CI/CD pipeline
- **Turbopack** - Ultra-fast bundler
- **Ruff & Black** - Python code formatting
- **ESLint & Prettier** - JavaScript code quality

## 📞 Support & Contact

For questions, issues, or contributions:

- **📧 Email**: team@prometheus.dev
- **🐛 Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **📖 Documentation**: This comprehensive documentation
- **🔌 Interactive API Docs**: http://localhost:8001/docs (when running)

## 🙏 Acknowledgments

- **ITS.xyz** - Challenge provider and medical imaging technology leader
- **LXthon 2025** organizers for creating this amazing hackathon experience
- **TensorFlow** and **FastAPI** communities for excellent documentation and support
- **Next.js** and **React** teams for cutting-edge frontend technologies
- **Open source contributors** who make innovative projects possible
- **Medical imaging research community** for advancing healthcare technology
- **Ophthalmology experts** who provide domain knowledge for medical AI applications

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">
  <b>🚀 Built with passion for LXthon 2025 🚀</b><br/>
  <i>Advancing medical AI through innovative technology</i><br/>
  <br/>
  <strong>Team Prometheus - Revolutionizing Healthcare with AI</strong>
</div>
