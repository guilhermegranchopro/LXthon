# Scripts Directory

This directory contains all automation scripts for the Eye Vessel Segmentation project.

## Structure

- `📁 dev/` - Development and setup scripts
- `📁 deployment/` - Docker and deployment configurations  
- `📁 utils/` - Utility scripts and helpers

## Quick Access

### Development
```bash
# Complete setup
./scripts/dev/dev-setup-complete.sh

# Start development servers
./scripts/dev/start-backend-dev.sh  # Backend (uv + hot reload)
./scripts/dev/start-frontend.sh     # Frontend (port 3001)
```

### Deployment
```bash
# Development environment
docker-compose -f scripts/deployment/docker-compose.yml up

# Production environment  
docker-compose -f scripts/deployment/docker-compose.prod.yml up -d
```

## Directory Details

See individual README files in each subdirectory for detailed information:
- [Development Scripts](dev/README.md)
- [Deployment Scripts](deployment/README.md)

All scripts are designed to be run from the project root directory.