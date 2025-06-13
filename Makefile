# LXthon 2025 - Eye Vessel Segmentation
# Team Prometheus: Guilherme Grancho & Vasco Pereira
# Professional Makefile for project automation

.PHONY: help install install-dev clean lint format test test-unit test-integration test-e2e
.PHONY: backend frontend dev docs build docker-build docker-up docker-down
.PHONY: train demo deploy check-deps setup

# Default target
.DEFAULT_GOAL := help

# Variables
PYTHON := python3
PIP := pip3
NPM := npm
DOCKER := docker
DOCKER_COMPOSE := docker-compose

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)LXthon 2025 - Eye Vessel Segmentation$(NC)"
	@echo "$(BLUE)Team Prometheus: Guilherme Grancho & Vasco Pereira$(NC)"
	@echo ""
	@echo "$(GREEN)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Installation targets
install: ## Install production dependencies
	@echo "$(GREEN)Installing production dependencies...$(NC)"
	$(PIP) install -e .

install-dev: ## Install development dependencies
	@echo "$(GREEN)Installing development dependencies...$(NC)"
	$(PIP) install -e ".[dev,backend,ml,docs]"
	cd src/frontend && $(NPM) install

install-backend: ## Install backend dependencies only
	@echo "$(GREEN)Installing backend dependencies...$(NC)"
	$(PIP) install -e ".[backend]"

install-frontend: ## Install frontend dependencies only
	@echo "$(GREEN)Installing frontend dependencies...$(NC)"
	cd src/frontend && $(NPM) install

# Development setup
setup: install-dev ## Complete development setup
	@echo "$(GREEN)Setting up development environment...$(NC)"
	pre-commit install || echo "Pre-commit not available"
	@echo "$(GREEN)Setup complete!$(NC)"

# Code quality targets
lint: ## Run linting checks
	@echo "$(GREEN)Running linting checks...$(NC)"
	ruff check src/ tests/ scripts/
	cd src/frontend && $(NPM) run lint

format: ## Format code
	@echo "$(GREEN)Formatting code...$(NC)"
	ruff format src/ tests/ scripts/
	black src/ tests/ scripts/
	isort src/ tests/ scripts/
	cd src/frontend && $(NPM) run format || echo "Frontend formatting not available"

format-check: ## Check code formatting
	@echo "$(GREEN)Checking code formatting...$(NC)"
	ruff format --check src/ tests/ scripts/
	black --check src/ tests/ scripts/
	isort --check-only src/ tests/ scripts/

type-check: ## Run type checking
	@echo "$(GREEN)Running type checks...$(NC)"
	mypy src/ tests/ scripts/

# Testing targets
test: ## Run all tests
	@echo "$(GREEN)Running all tests...$(NC)"
	pytest tests/ -v

test-unit: ## Run unit tests only
	@echo "$(GREEN)Running unit tests...$(NC)"
	pytest tests/unit/ -v

test-integration: ## Run integration tests only
	@echo "$(GREEN)Running integration tests...$(NC)"
	pytest tests/integration/ -v

test-e2e: ## Run end-to-end tests
	@echo "$(GREEN)Running end-to-end tests...$(NC)"
	pytest tests/e2e/ -v

test-coverage: ## Run tests with coverage report
	@echo "$(GREEN)Running tests with coverage...$(NC)"
	pytest tests/ --cov=src --cov-report=html --cov-report=term

# Development servers
backend: ## Run backend development server
	@echo "$(GREEN)Starting backend server...$(NC)"
	cd src/backend && $(PYTHON) -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload

frontend: ## Run frontend development server
	@echo "$(GREEN)Starting frontend server...$(NC)"
	cd src/frontend && $(NPM) run dev

dev: ## Run both backend and frontend in development mode
	@echo "$(GREEN)Starting development servers...$(NC)"
	@$(MAKE) backend &
	@$(MAKE) frontend &
	@echo "$(YELLOW)Press Ctrl+C to stop servers$(NC)"

# ML Training and Demo
train: ## Train the U-Net model
	@echo "$(GREEN)Training U-Net model...$(NC)"
	$(PYTHON) scripts/data/train_model.py

demo: ## Run standalone demo
	@echo "$(GREEN)Running demo...$(NC)"
	$(PYTHON) scripts/data/standalone_demo.py

# Documentation
docs: ## Build documentation
	@echo "$(GREEN)Building documentation...$(NC)"
	mkdocs build

docs-serve: ## Serve documentation locally
	@echo "$(GREEN)Serving documentation...$(NC)"
	mkdocs serve

# Docker targets
docker-build: ## Build Docker images
	@echo "$(GREEN)Building Docker images...$(NC)"
	$(DOCKER_COMPOSE) -f deployment/docker/docker-compose.yml build

docker-up: ## Start Docker containers
	@echo "$(GREEN)Starting Docker containers...$(NC)"
	$(DOCKER_COMPOSE) -f deployment/docker/docker-compose.yml up -d

docker-down: ## Stop Docker containers
	@echo "$(GREEN)Stopping Docker containers...$(NC)"
	$(DOCKER_COMPOSE) -f deployment/docker/docker-compose.yml down

docker-logs: ## Show Docker logs
	@echo "$(GREEN)Showing Docker logs...$(NC)"
	$(DOCKER_COMPOSE) -f deployment/docker/docker-compose.yml logs -f

# Production deployment
build: ## Build production assets
	@echo "$(GREEN)Building production assets...$(NC)"
	cd src/frontend && $(NPM) run build
	$(PYTHON) -m build

deploy-prod: ## Deploy to production
	@echo "$(GREEN)Deploying to production...$(NC)"
	$(DOCKER_COMPOSE) -f deployment/docker/docker-compose.prod.yml up -d

# Cleanup targets
clean: ## Clean build artifacts
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info/
	rm -rf .pytest_cache/
	rm -rf .coverage
	rm -rf htmlcov/
	rm -rf .mypy_cache/
	rm -rf .ruff_cache/
	find . -type d -name __pycache__ -delete
	find . -type f -name "*.pyc" -delete

clean-data: ## Clean temporary data files
	@echo "$(YELLOW)Cleaning temporary data files...$(NC)"
	find data/ -name "*.tmp" -delete
	find data/ -name "*.log" -delete

clean-all: clean clean-data ## Clean everything
	@echo "$(GREEN)Deep cleaning...$(NC)"
	cd src/frontend && $(NPM) run clean || echo "Frontend clean not available"
	$(DOCKER) system prune -f

# Utility targets
check-deps: ## Check for dependency updates
	@echo "$(GREEN)Checking for dependency updates...$(NC)"
	$(PIP) list --outdated
	cd src/frontend && $(NPM) outdated || true

security-check: ## Run security checks
	@echo "$(GREEN)Running security checks...$(NC)"
	bandit -r src/ scripts/
	safety check

pre-commit: ## Run pre-commit hooks
	@echo "$(GREEN)Running pre-commit hooks...$(NC)"
	pre-commit run --all-files

# Project info
info: ## Show project information
	@echo "$(BLUE)LXthon 2025 - Eye Vessel Segmentation$(NC)"
	@echo "$(BLUE)Team Prometheus: Guilherme Grancho & Vasco Pereira$(NC)"
	@echo ""
	@echo "$(YELLOW)Project Structure:$(NC)"
	@echo "  src/backend/     - FastAPI backend (Python)"
	@echo "  src/frontend/    - Next.js frontend (TypeScript)"
	@echo "  data/models/     - Trained ML models"
	@echo "  data/datasets/   - Training datasets"
	@echo "  tests/           - Test suites"
	@echo "  docs/            - Documentation"
	@echo "  scripts/         - Utility scripts"
	@echo ""
	@echo "$(YELLOW)Key Technologies:$(NC)"
	@echo "  - FastAPI $(shell $(PIP) show fastapi | grep Version || echo 'Not installed')"
	@echo "  - TensorFlow $(shell $(PIP) show tensorflow | grep Version || echo 'Not installed')"
	@echo "  - Next.js $(shell cd src/frontend 2>/dev/null && $(NPM) list next --depth=0 2>/dev/null | grep next || echo 'Not installed')"

# Development workflow
workflow: clean install-dev lint format type-check test ## Complete development workflow
	@echo "$(GREEN)Development workflow completed successfully!$(NC)"

# CI/CD simulation
ci: clean install-dev lint format-check type-check test-coverage security-check ## Simulate CI/CD pipeline
	@echo "$(GREEN)CI/CD pipeline completed successfully!$(NC)"
