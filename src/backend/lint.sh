#!/bin/zsh

# Lint and Format Script using ruff
# Run this script to check and format code quality

set -e

echo "🔍 Running ruff linting and formatting..."

# Check if we're in a virtual environment
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "⚠️  Virtual environment not activated. Activating..."
    source .venv/bin/activate
fi

echo "📋 Checking code with ruff..."
ruff check app/ --fix

echo "🎨 Formatting code with ruff..."
ruff format app/

echo "✅ Code linting and formatting complete!"

echo ""
echo "📊 Code quality summary:"
echo "  - Fixed auto-fixable issues"
echo "  - Formatted code according to style guidelines"
echo "  - Run 'ruff check app/' to see remaining issues"
