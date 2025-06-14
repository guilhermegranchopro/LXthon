# Tests Directory

This directory contains all test files and validation scripts for the Eye Vessel Segmentation project.

## Test Files

- `test_backend.py` - Backend API tests
- `test_application.py` - Application integration tests
- `test_complete_system.py` - End-to-end system tests
- `test_full_app.py` - Full application workflow tests
- `validate_app.py` - Application validation and health checks

## Test Categories

### Unit Tests
- Backend service tests
- Model prediction tests
- API endpoint tests

### Integration Tests
- Frontend-backend communication
- File upload and processing
- Image segmentation workflow

### System Tests
- Complete application flow
- Performance validation
- Error handling

## Usage

### Run All Tests
```bash
# Using pytest (recommended)
cd backend && pytest ../tests/

# Individual test files
python tests/test_backend.py
python tests/test_application.py
```

### Validation
```bash
# Validate application setup
python tests/validate_app.py

# Complete system test
python tests/test_complete_system.py
```

### Backend Tests
```bash
# Backend-specific tests
python tests/test_backend.py
```

## Requirements

Tests require the backend dependencies:
```bash
cd backend
pip install -r requirements.txt
# or with uv:
uv pip install -e ".[dev]"
```

## Test Data

Tests use sample images and may require:
- Sample eye images in the dataset directory
- Trained model file in backend/models/
- Running backend server (for integration tests)

## Continuous Integration

These tests can be integrated into CI/CD pipelines for automated testing.