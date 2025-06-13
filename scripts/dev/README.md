# Development Scripts

This directory contains all development and setup scripts for the Eye Vessel Segmentation project.

## Quick Start Scripts

- `dev-setup-complete.sh` - Complete development environment setup (backend + frontend)
- `start-backend-dev.sh` - Start backend development server with uv and hot reload
- `start-frontend.sh` - Start frontend development server (port 3001)

## Setup Scripts

- `dev-setup.sh` - Basic development setup
- `setup.sh` - General project setup
- `setup_app.sh` - Application setup
- `setup_git_lfs.sh` - Git LFS setup for large model files

## Individual Service Scripts

- `start-backend.sh` - Start backend server (Docker)
- `start_app.sh` - Start complete application
- `run_frontend.sh` - Alternative frontend runner

## Testing & Validation

- `test.sh` - Run tests
- `verify_port_update.sh` - Verify port configuration changes

## Usage

### Complete Setup (Recommended)
```bash
# One-command setup for everything
./dev-setup-complete.sh
```

### Individual Services
```bash
# Backend development (with uv and hot reload)
./start-backend-dev.sh

# Frontend development (port 3001)
./start-frontend.sh
```

### Testing
```bash
# Run validation tests
./test.sh
```

All scripts are designed to be run from the project root directory.
