# LXthon 2025 - Eye Vessel Segmentation Repository Structure

## 📁 Project Organization

```text
LXthon/
├── 📄 README.md                    # Main project documentation
├── 📄 LICENSE                      # MIT License
├── 📄 Makefile                     # Build automation
├── 📄 docker-compose.yml           # Multi-service orchestration
├── 📄 pyproject.toml              # Python project configuration
├── 📄 REPOSITORY_STRUCTURE.md     # This file
│
├── � presentations/               # 🏆 Winning Materials & Presentations
│   ├── 📄 README.md               # Presentations documentation
│   ├── 📄 certificate.pdf         # 🥇 LXthon 2025 winning certificate
│   ├── 📄 LXthon_Presentation.pdf # Complete project presentation
│   ├── 📄 image.png               # PDF preview for README
│   └── 📄 image2.png              # Certificate preview for README
│
├── 📂 assets/                      # Project assets and logos
│   ├── 📄 LXthon_Teaser.pdf       # Project teaser document
│   └── 📂 logos/                   # Brand logos and assets
│
├── 📂 backend/                     # FastAPI Backend Service
│   ├── 📄 Dockerfile              # Backend containerization
│   ├── 📄 Makefile                # Backend build tasks
│   ├── 📄 requirements.txt        # Python dependencies
│   ├── 📄 pyproject.toml         # Backend Python config
│   └── 📂 app/                    # Application code
│       ├── 📄 main.py             # FastAPI entry point
│       ├── 📂 models/             # Data models
│       ├── 📂 services/           # Business logic
│       └── 📂 utils/              # Utility functions
│
├── 📂 frontend/                    # Next.js Frontend Application
│   ├── 📄 package.json           # Node.js dependencies
│   ├── 📄 next.config.js         # Next.js configuration
│   ├── 📄 tailwind.config.js     # Tailwind CSS config
│   ├── 📄 tsconfig.json          # TypeScript config
│   ├── 📄 Dockerfile             # Frontend containerization
│   ├── 📂 public/                # Static assets
│   └── 📂 src/                    # Source code
│       ├── 📂 app/                # App Router pages
│       ├── 📂 components/         # React components
│       ├── 📂 hooks/              # Custom React hooks
│       └── 📂 lib/                # Utility libraries
│
├── 📂 data/                       # Data and Models
│   ├── 📂 datasets/              # Training/test datasets
│   │   ├── 📂 train_dataset_mc/   # Training data
│   │   ├── 📂 test_dataset_mc/    # Test data
│   │   └── 📂 test_ground_truth/  # Ground truth masks
│   ├── 📂 models/                 # ML Models
│   │   └── 📄 unet_eye_segmentation.keras # Trained model (258M params)
│   └── 📂 samples/                # Sample images
│
├── 📂 notebooks/                  # Jupyter Notebooks
│   ├── 📄 model_training.ipynb   # Model training notebook
│   └── 📂 training/               # Training experiments
│
├── 📂 scripts/                    # Automation Scripts
│   ├── 📂 setup/                 # Setup and installation
│   ├── 📂 deployment/            # Deployment scripts
│   ├── 📂 testing/               # Test scripts
│   │   └── 📄 test_prediction.py # Prediction testing
│   └── 📂 utilities/             # General utilities
│
├── 📂 tests/                      # Test Suite
│   ├── 📂 unit/                  # Unit tests
│   └── 📄 README.md              # Testing documentation
│
├── 📂 docs/                       # Documentation
│   ├── 📄 README.md              # Documentation index
│   ├── 📂 api/                   # API documentation
│   ├── 📂 deployment/            # Deployment guides
│   ├── 📂 development/           # Development setup
│   └── 📂 project-reports/       # Project status reports
│       ├── 📄 APPLICATION_FIXED_AND_OPERATIONAL.md
│       ├── 📄 BACKEND_HEALTH_RESOLUTION.md
│       ├── 📄 MISSION_ACCOMPLISHED.md
│       └── 📄 ... (other reports)
│
├── 📂 deployment/                 # Deployment Configuration
│   ├── 📂 docker/               # Docker configurations
│   ├── 📂 kubernetes/           # K8s manifests
│   └── 📂 cloud/                # Cloud deployment
│
├── 📂 config/                     # Configuration Files
│   ├── 📄 .env.development       # Development environment
│   └── 📄 .env.production        # Production environment
│
├── 📂 logs/                       # Application Logs
│   ├── 📄 backend.log            # Backend logs
│   └── 📄 frontend.log           # Frontend logs
│
├── 📂 tools/                      # Development Tools
│   ├── 📂 linting/               # Code quality tools
│   ├── 📂 monitoring/            # Performance monitoring
│   └── 📂 testing/               # Testing utilities
│
└── 📂 .github/                    # GitHub Configuration
    └── 📂 workflows/              # CI/CD workflows
```

## 🎯 Key Components

### Backend (FastAPI)

- **Language**: Python 3.10+
- **Framework**: FastAPI with Uvicorn
- **AI Model**: U-Net + EfficientNet (258M parameters)
- **Performance**: F1-Score 0.73
- **Port**: 8001

### Frontend (Next.js)

- **Framework**: Next.js 15.3.3 with TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: Shadcn/ui components
- **Animations**: Framer Motion
- **Port**: 3001

### Data Pipeline

- **Model Format**: Keras (.keras)
- **Input Size**: 256x256 pixels
- **Output**: Binary segmentation masks
- **Dataset**: Slit-lamp eye images

## 🚀 Quick Start

1. **Backend**: `cd backend && python -m uvicorn app.main:app --port 8001`
2. **Frontend**: `cd frontend && npm run dev`
3. **Full Stack**: `docker-compose up`

## 📊 Project Status

- ✅ Backend: FastAPI operational with model loaded
- ✅ Frontend: Next.js application running smoothly
- ✅ Integration: CORS configured, API communication working
- ✅ Models: 258M parameter U-Net + EfficientNet loaded
- ✅ Metrics: F1-Score 0.73 displayed in UI
- ✅ Repository: Clean, organized structure
