# Deployment Scripts

This directory contains Docker and deployment configurations for the Eye Vessel Segmentation project.

## Files

- `docker-compose.yml` - Development Docker Compose configuration
- `docker-compose.prod.yml` - Production Docker Compose configuration

## Usage

### Development Deployment
```bash
# Start development environment with Docker
docker-compose -f scripts/deployment/docker-compose.yml up
```

### Production Deployment
```bash
# Start production environment
docker-compose -f scripts/deployment/docker-compose.prod.yml up -d
```

### Services

Both configurations include:
- **Backend**: FastAPI + TensorFlow (port 8000)
- **Frontend**: Next.js application (port 3001)

### Environment Variables

Make sure to configure any required environment variables before deployment.

### Volumes

- Model files are mounted from `backend/models/`
- Development builds include source code mounting for hot reload
