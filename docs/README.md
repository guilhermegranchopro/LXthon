# 📚 LXthon 2025 Documentation

Welcome to the comprehensive documentation for the LXthon 2025 Eye Vessel Segmentation project by **Team Prometheus**.

## 📖 Documentation Structure

### 🚀 Getting Started
- [Quick Start Guide](development/quick-start.md)
- [Installation Guide](development/installation.md)
- [Development Setup](development/setup.md)

### 🏗️ Architecture & Design
- [System Architecture](architecture/system-overview.md)
- [AI/ML Components](architecture/ml-components.md)
- [Frontend Architecture](architecture/frontend.md)
- [Backend Architecture](architecture/backend.md)

### 🔧 API Documentation
- [REST API Reference](api/rest-api.md)
- [WebSocket API](api/websocket.md)
- [Authentication](api/authentication.md)
- [Error Handling](api/error-handling.md)

### 🚀 Deployment
- [Docker Deployment](deployment/docker.md)
- [Production Setup](deployment/production.md)
- [Environment Configuration](deployment/environment.md)
- [Monitoring & Logging](deployment/monitoring.md)

### 🧪 Testing
- [Testing Strategy](development/testing.md)
- [Unit Tests](development/unit-tests.md)
- [Integration Tests](development/integration-tests.md)
- [E2E Tests](development/e2e-tests.md)

### 🧠 AI/ML Documentation
- [Model Architecture](ml/model-architecture.md)
- [Training Process](ml/training.md)
- [Data Processing](ml/data-processing.md)
- [Performance Metrics](ml/performance.md)

### 📊 Reports & Analysis
- [Performance Reports](reports/)
- [Upgrade Documentation](reports/)
- [System Status](reports/)

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

## 👥 Team

- **Guilherme Grancho** - Full-stack development, AI integration

## 🏆 Innovation Highlights

- **Real-time Processing**: Sub-3-second analysis pipeline
- **Modern Architecture**: Microservices with Docker deployment
- **User Experience**: Intuitive drag-and-drop interface
- **Scalability**: Cloud-ready containerized deployment
- **Extensibility**: Modular design for easy feature addition

---

**Built with ❤️ for LXthon 2024 Hackathon**
