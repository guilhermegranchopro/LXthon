# Makefile for Eye Vessel Segmentation Backend

.PHONY: help install dev-install lint format test clean run docker-build

# Default target
help:
	@echo "Available commands:"
	@echo "  install      - Install dependencies using uv"
	@echo "  dev-install  - Install with development dependencies"
	@echo "  lint         - Run ruff linting"
	@echo "  format       - Format code with ruff"
	@echo "  test         - Run tests with pytest"
	@echo "  clean        - Clean cache and temporary files"
	@echo "  run          - Start development server"
	@echo "  docker-build - Build Docker image"
	@echo "  pre-commit   - Install pre-commit hooks"

# Setup virtual environment and install dependencies
install:
	uv venv
	source .venv/bin/activate && uv pip install -e .

# Install with development dependencies
dev-install:
	uv venv
	source .venv/bin/activate && uv pip install -e ".[dev]"

# Run linting
lint:
	source .venv/bin/activate && ruff check app/

# Format code
format:
	source .venv/bin/activate && ruff format app/

# Fix linting issues automatically
lint-fix:
	source .venv/bin/activate && ruff check app/ --fix

# Run tests
test:
	source .venv/bin/activate && pytest

# Clean cache and temporary files
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +
	find . -name "*.pyc" -delete

# Start development server
run:
	source .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Build Docker image
docker-build:
	docker build -t eye-vessel-backend .

# Install pre-commit hooks
pre-commit:
	source .venv/bin/activate && pre-commit install

# Run all quality checks
check: lint test
	@echo "✅ All checks passed!"

# Development setup (install + pre-commit + first lint)
dev-setup: dev-install pre-commit lint-fix
	@echo "🎉 Development environment ready!"
