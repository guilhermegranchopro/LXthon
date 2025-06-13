# Tools Directory

This directory contains utility tools and scripts for model training, data processing, and development tasks.

## Model Training Tools

- `train_model.py` - Main model training script with full U-Net implementation
- `quick_train.py` - Quick training script for testing and development

## Demo and Testing Tools

- `create_demo.py` - Generate demonstration images and results
- `standalone_demo.py` - Standalone demonstration script
- `run_backend.py` - Utility to run backend programmatically

## Model Utilities

- `create_dummy_model.py` - Create dummy model for testing without GPU
- `final_summary.py` - Generate final project summary and reports

## Usage

### Model Training
```bash
# Full training (requires GPU and dataset)
python tools/train_model.py

# Quick training for testing
python tools/quick_train.py
```

### Demonstration
```bash
# Create demo images
python tools/create_demo.py

# Run standalone demo
python tools/standalone_demo.py
```

### Development
```bash
# Create dummy model for testing
python tools/create_dummy_model.py

# Generate project summary
python tools/final_summary.py
```

## Requirements

Most tools require the backend dependencies. Install them with:
```bash
cd backend
pip install -r requirements.txt
# or with uv:
uv pip install -e ".[dev]"
```

Some tools may require additional dependencies for training (GPU drivers, CUDA, etc.).