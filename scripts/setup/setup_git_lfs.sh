#!/bin/bash
# Git LFS Setup for Large Model Files
# Handles the 280MB model file that exceeds GitHub's 100MB limit

echo "📦 Git LFS Setup for Eye Vessel Segmentation Project"
echo "===================================================="
echo ""

# Check if git-lfs is installed
if ! command -v git-lfs &> /dev/null; then
    echo "❌ Git LFS is not installed."
    echo ""
    echo "To install Git LFS:"
    echo "  Ubuntu/Debian: sudo apt install git-lfs"
    echo "  macOS: brew install git-lfs"
    echo "  Or download from: https://git-lfs.github.io/"
    echo ""
    exit 1
fi

echo "✅ Git LFS is installed"

# Initialize Git LFS in the repository
echo "🔧 Initializing Git LFS..."
git lfs install

# Track the model file
echo "📋 Tracking .keras model files with Git LFS..."
git lfs track "*.keras"
git lfs track "backend/models/*.keras"

# Add .gitattributes to track these changes
echo "📝 Updating .gitattributes..."
git add .gitattributes

# Check if the model file exists and needs to be moved to LFS
MODEL_FILE="backend/models/unet_eye_segmentation.keras"
if [ -f "$MODEL_FILE" ]; then
    echo "🧠 Model file found: $MODEL_FILE"
    
    # Check file size
    SIZE=$(du -h "$MODEL_FILE" | cut -f1)
    echo "📊 Model file size: $SIZE"
    
    echo ""
    echo "⚠️  To resolve the GitHub push error:"
    echo "1. Remove the large file from Git history:"
    echo "   git rm --cached $MODEL_FILE"
    echo ""
    echo "2. Add the file back (now it will use LFS):"
    echo "   git add $MODEL_FILE"
    echo ""
    echo "3. Commit the changes:"
    echo "   git commit -m 'Move model file to Git LFS'"
    echo ""
    echo "4. Push to GitHub:"
    echo "   git push origin Guilherme_Grancho:Guilherme_Grancho"
    echo ""
else
    echo "ℹ️  Model file not found - you may need to download it separately"
fi

# Show LFS status
echo "📈 Git LFS Status:"
git lfs ls-files

echo ""
echo "✅ Git LFS setup complete!"
echo ""
echo "🔗 Alternative approaches for the model file:"
echo "1. Use Git LFS (recommended for GitHub)"
echo "2. Store model in cloud storage (S3, Google Drive, etc.)"
echo "3. Use model hosting services (Hugging Face, etc.)"
echo "4. Download model on deployment/startup"
echo ""
echo "📖 Documentation:"
echo "- Git LFS: https://git-lfs.github.com/"
echo "- GitHub LFS: https://docs.github.com/en/repositories/working-with-files/managing-large-files"
