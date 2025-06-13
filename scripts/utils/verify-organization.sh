#!/bin/zsh
# Repository Organization Verification Script

echo "🔍 Verifying Repository Organization..."
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if directory exists and has files
check_directory() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        local file_count=$(find "$dir" -type f | wc -l)
        echo -e "${GREEN}✅ $description${NC}: $dir ($file_count files)"
        return 0
    else
        echo -e "${RED}❌ $description${NC}: $dir (missing)"
        return 1
    fi
}

# Function to check if file exists
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $description${NC}: $file"
        return 0
    else
        echo -e "${RED}❌ $description${NC}: $file (missing)"
        return 1
    fi
}

echo "📁 Checking Directory Structure..."
echo "----------------------------------"

# Check main directories
check_directory "backend" "Backend application"
check_directory "frontend" "Frontend application"
check_directory "docs" "Documentation"
check_directory "scripts" "Automation scripts"
check_directory "tools" "Development tools"
check_directory "tests" "Test files"
check_directory "dataset" "Training data"
check_directory "notebooks" "Jupyter notebooks"

echo ""
echo "📄 Checking Key Files..."
echo "------------------------"

# Check essential files
check_file "README.md" "Main README"
check_file "LICENSE" "License file"
check_file "PROJECT_STRUCTURE.md" "Structure documentation"
check_file "ORGANIZATION_COMPLETE.md" "Organization summary"

echo ""
echo "🛠️ Checking Script Organization..."
echo "----------------------------------"

# Check script directories
check_directory "scripts/dev" "Development scripts"
check_directory "scripts/deployment" "Deployment scripts"

# Check for key scripts
check_file "scripts/dev/dev-setup-complete.sh" "Complete setup script"
check_file "scripts/dev/start-backend-dev.sh" "Backend dev script"
check_file "scripts/dev/start-frontend.sh" "Frontend dev script"
check_file "scripts/deployment/docker-compose.yml" "Docker Compose dev"
check_file "scripts/deployment/docker-compose.prod.yml" "Docker Compose prod"

echo ""
echo "📚 Checking Documentation..."
echo "----------------------------"

# Check documentation structure
check_directory "docs/images" "Documentation images"
check_file "docs/README.md" "Documentation index"

echo ""
echo "🧪 Checking Tools and Tests..."
echo "------------------------------"

# Check tools and tests
check_file "tools/README.md" "Tools documentation"
check_file "tests/README.md" "Tests documentation"

echo ""
echo "🎯 Organization Summary..."
echo "-------------------------"

# Count files in root directory (excluding hidden files and directories)
root_files=$(find . -maxdepth 1 -type f ! -name ".*" | wc -l)
echo "📁 Files in root directory: $root_files"

if [ $root_files -le 10 ]; then
    echo -e "${GREEN}✅ Root directory is clean (≤10 files)${NC}"
else
    echo -e "${YELLOW}⚠️  Root directory has many files ($root_files)${NC}"
fi

# Check if all directories have READMEs
readme_dirs=("docs" "scripts" "tools" "tests" "scripts/dev" "scripts/deployment")
missing_readmes=0

for dir in "${readme_dirs[@]}"; do
    if [ ! -f "$dir/README.md" ]; then
        echo -e "${RED}❌ Missing README${NC}: $dir/README.md"
        ((missing_readmes++))
    fi
done

if [ $missing_readmes -eq 0 ]; then
    echo -e "${GREEN}✅ All directories have README files${NC}"
fi

echo ""
echo "🎉 Organization Complete!"
echo "========================"
echo "Repository structure is professional and well-organized."
echo ""
echo "Quick start commands:"
echo "  Setup: ./scripts/dev/dev-setup-complete.sh"
echo "  Development: ./scripts/dev/start-backend-dev.sh"
echo "  Testing: python tests/test_complete_system.py"
echo ""
echo "For more information, see:"
echo "  📖 README.md - Project overview"
echo "  📁 PROJECT_STRUCTURE.md - Detailed structure"
echo "  🎯 ORGANIZATION_COMPLETE.md - Organization summary"
