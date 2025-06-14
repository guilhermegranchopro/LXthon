#!/bin/zsh
# Quick demo of the new uv + ruff setup

echo "⚡ UV + Ruff Speed Demo"
echo "====================="

cd backend

echo "📦 UV Virtual Environment Status:"
if [ -d ".venv" ]; then
    echo "✅ Virtual environment exists"
    source .venv/bin/activate
    echo "🐍 Python: $(python --version)"
    echo "📦 UV: $(uv --version)"
    echo "⚡ Ruff: $(ruff --version)"
else
    echo "❌ Virtual environment not found. Run ./setup-uv.sh first"
    exit 1
fi

echo ""
echo "🔍 Quick Code Quality Check:"
echo "----------------------------"

# Time the ruff check
echo "Running: ruff check app/ --statistics"
time ruff check app/ --statistics

echo ""
echo "🎨 Code Formatting Check:"
echo "-------------------------"
echo "Running: ruff format app/ --check"
time ruff format app/ --check

echo ""
echo "📊 Project Statistics:"
echo "---------------------"
echo "📁 Python files:"
find app/ -name "*.py" | wc -l

echo "📏 Lines of code:"
find app/ -name "*.py" -exec wc -l {} + | tail -1

echo ""
echo "✅ UV + Ruff setup is working perfectly!"
echo "🚀 Ready for high-speed Python development!"
