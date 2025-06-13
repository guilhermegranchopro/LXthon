# Project Structure Documentation

This document describes the organized structure of the Eye Vessel Segmentation project after reorganization.

## 📁 Directory Structure

```
📦 eye-vessel-segmentation/
├── 📄 README.md                    # Main project documentation
├── 📄 LICENSE                      # MIT License
├── 📄 .gitignore                   # Git ignore rules
├── 📄 .gitattributes              # Git LFS configuration
├── 📁 .vscode/                    # VS Code settings
├── 📁 .git/                       # Git repository data
│
├── 🐳 backend/                     # FastAPI + TensorFlow Backend
│   ├── 📄 Dockerfile              # Backend container definition
│   ├── 📄 pyproject.toml          # Modern Python dependencies (uv)
│   ├── 📄 requirements.txt        # Docker compatibility dependencies
│   ├── 📄 Makefile                # Development automation
│   ├── 📄 lint.sh                 # Code linting script
│   ├── 📄 setup-uv.sh             # UV environment setup
│   ├── 📄 speed-demo.sh           # Performance demonstration
│   ├── 🐍 app/                    # Application source code
│   │   ├── 📄 __init__.py         # Package initialization
│   │   ├── 📄 main.py             # FastAPI application entry
│   │   ├── 📁 models/             # Data models and schemas
│   │   ├── 📁 services/           # Business logic services
│   │   └── 📁 utils/              # Utility functions
│   └── 🤖 models/                 # Trained ML model files
│       └── 📄 unet_eye_segmentation.keras
│
├── 🎨 frontend/                    # Next.js + TypeScript Frontend
│   ├── 📄 Dockerfile              # Frontend container
│   ├── 📄 Dockerfile.prod         # Production container
│   ├── 📄 package.json            # Node.js dependencies
│   ├── 📄 next.config.js          # Next.js configuration
│   ├── 📄 tsconfig.json           # TypeScript configuration
│   ├── 📄 tailwind.config.js      # Tailwind CSS config
│   ├── 📄 postcss.config.js       # PostCSS configuration
│   ├── 📁 src/                    # Source code
│   │   ├── 📁 app/                # Next.js App Router
│   │   ├── 📁 components/         # React components
│   │   └── 📁 lib/                # Utility libraries
│   └── 📁 public/                 # Static assets
│
├── 📊 dataset/                     # Training and Test Data
│   ├── 📁 train_dataset_mc/       # Training images & annotations
│   │   ├── 📄 *.png              # Training images
│   │   └── 📄 *.geojson          # Annotation files
│   ├── 📁 test_dataset_mc/        # Test images
│   │   └── 📁 eye_test/          # Test image files
│   └── 📁 test_ground_truth/      # Ground truth masks
│       └── 📁 eye_mask/          # Mask files
│
├── 📚 docs/                       # Documentation
│   ├── 📄 README.md              # Documentation index
│   ├── 📄 DEMO_REPORT.md         # Demo and testing report
│   ├── 📄 PORT_UPDATE_SUMMARY.md # Port configuration changes
│   ├── 📄 PRESENTATION.md        # Project presentation
│   ├── 📄 PROJECT_SUMMARY.md     # Complete project summary
│   ├── 📄 SETUP_COMPLETE.md      # Setup completion guide
│   ├── 📄 UV_RUFF_SETUP.md       # Modern Python tooling
│   ├── 📄 project_structure.md   # Original structure
│   ├── 📄 ITS EYE challenge.pdf  # Challenge specification
│   ├── 📁 images/                # Screenshots and demos
│   │   ├── 📄 demo_result.png    # Segmentation result example
│   │   └── 📄 eye_vessel_demo.png # Demo application screenshot
│   ├── 📁 api/                   # API documentation
│   └── 📁 setup/                 # Setup guides
│
├── 🛠️ scripts/                    # Automation Scripts
│   ├── 📄 README.md              # Scripts documentation
│   ├── 📁 dev/                   # Development scripts
│   │   ├── 📄 README.md          # Development scripts guide
│   │   ├── 📄 dev-setup-complete.sh # Complete setup
│   │   ├── 📄 start-backend-dev.sh  # Backend dev server
│   │   ├── 📄 start-frontend.sh     # Frontend dev server
│   │   ├── 📄 setup.sh              # General setup
│   │   ├── 📄 setup_git_lfs.sh      # Git LFS setup
│   │   └── 📄 *.sh                  # Other dev scripts
│   ├── 📁 deployment/            # Deployment configurations
│   │   ├── 📄 README.md          # Deployment guide
│   │   ├── 📄 docker-compose.yml     # Development Docker
│   │   └── 📄 docker-compose.prod.yml # Production Docker
│   └── 📁 utils/                 # Utility scripts
│
├── 🔧 tools/                      # Development Tools
│   ├── 📄 README.md              # Tools documentation
│   ├── 📄 train_model.py         # Model training script
│   ├── 📄 quick_train.py         # Quick training for testing
│   ├── 📄 create_demo.py         # Demo generation
│   ├── 📄 standalone_demo.py     # Standalone demonstration
│   ├── 📄 create_dummy_model.py  # Testing model creation
│   ├── 📄 run_backend.py         # Backend utility runner
│   └── 📄 final_summary.py       # Project summary generator
│
├── 🧪 tests/                      # Test Files
│   ├── 📄 README.md              # Testing documentation
│   ├── 📄 test_backend.py        # Backend API tests
│   ├── 📄 test_application.py    # Application tests
│   ├── 📄 test_complete_system.py # End-to-end tests
│   ├── 📄 test_full_app.py       # Full workflow tests
│   └── 📄 validate_app.py        # Validation scripts
│
├── 📓 notebooks/                  # Jupyter Notebooks
│   └── 📄 model_training.ipynb   # Training notebook
│
└── 📊 logs/                       # Application Logs
    └── 📄 *.log                   # Log files
```

## 🗂️ Organization Principles

### 1. **Clear Separation of Concerns**
- **Backend**: All Python/FastAPI code and models
- **Frontend**: All Next.js/React code and assets
- **Scripts**: All automation and deployment scripts
- **Tools**: Development and training utilities
- **Tests**: All testing and validation code
- **Docs**: All documentation and guides

### 2. **Logical Grouping**
- Related files are grouped together
- Similar functionality in same directories
- Clear naming conventions

### 3. **Development Workflow**
- Quick access to common tasks
- Organized scripts for different purposes
- Clear documentation in each directory

## 🚀 Quick Access Patterns

### Development
```bash
# Setup
./scripts/dev/dev-setup-complete.sh

# Development servers
./scripts/dev/start-backend-dev.sh
./scripts/dev/start-frontend.sh
```

### Testing
```bash
# Run tests
python tests/test_complete_system.py

# Validate setup
python tests/validate_app.py
```

### Deployment
```bash
# Development deployment
docker-compose -f scripts/deployment/docker-compose.yml up

# Production deployment
docker-compose -f scripts/deployment/docker-compose.prod.yml up -d
```

### Tools & Utilities
```bash
# Model training
python tools/train_model.py

# Create demonstrations
python tools/create_demo.py
```

## 📋 Benefits of This Structure

1. **Developer Friendly**: Easy to find files and understand project layout
2. **Scalable**: Can easily add new components without clutter
3. **Maintainable**: Clear separation makes maintenance easier
4. **Professional**: Follows industry best practices
5. **CI/CD Ready**: Organized structure supports automation
6. **Documentation Focused**: Everything is well-documented

## 🔄 Migration Notes

All files have been moved from the root directory to their appropriate locations:
- Scripts moved to `scripts/dev/` and `scripts/deployment/`
- Documentation consolidated in `docs/`
- Images organized in `docs/images/`
- Tests grouped in `tests/`
- Development tools in `tools/`
- READMEs added to each directory for guidance

The project maintains full functionality while providing a much cleaner and more professional structure.
