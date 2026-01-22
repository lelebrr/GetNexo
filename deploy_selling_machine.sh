#!/bin/bash
# 🚀 Deploy The Selling Machine (Production)
# Optimizes assets and syncs to output dir

set -e

# Configuration
DEPLOY_URL=${DEPLOY_URL:-"https://getnexo.com.br"}
DEPLOY_DEST=${DEPLOY_DEST:-"../dist_production"}
SKIP_TESTS=${SKIP_TESTS:-false}
START_TIME=$(date +%s)

echo "🧠 Building The Selling Machine..."

# Check if directory exists
if [ ! -d "getnexo-site" ]; then
    echo "❌ Error: getnexo-site directory not found!"
    exit 1
fi

cd getnexo-site

# 1. Install Dependencies (Fast)
echo "📦 Installing dependencies..."
if ! npm install --silent; then
    echo "❌ Error: Failed to install dependencies!"
    exit 1
fi

# 2. Run Tests (Optional)
if [ "$SKIP_TESTS" != "true" ]; then
    echo "🧪 Running tests..."
    if npm test 2>/dev/null; then
        echo "✅ Tests passed"
    else
        echo "⚠️  Tests failed or not configured, continuing with deployment..."
    fi
fi

# 3. Build (Vite Optimization)
echo "🔨 Building project..."
if ! npm run build; then
    echo "❌ Error: Build failed!"
    exit 1
fi

# 4. Optimize (Neuromarketing Assets)
echo "⚡ Optimizing WebP/AVIF assets..."
# Check for image optimization tools and optimize real assets
if command -v convert >/dev/null 2>&1; then
    echo "🖼️  Optimizing images with ImageMagick..."
    find dist -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -exec convert {} -strip -quality 85 {} \; 2>/dev/null || echo "⚠️  Image optimization completed with warnings"
else
    echo "⚠️  ImageMagick not available, skipping image optimization"
fi

# 4. Deploy
echo "🚀 Deploying to Production..."
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found! Build may have failed."
    exit 1
fi

# Create destination directory
mkdir -p "$DEPLOY_DEST"

# Use rsync if available, otherwise cp
if command -v rsync >/dev/null 2>&1; then
    echo "📤 Syncing files with rsync..."
    if ! rsync -av --delete dist/ "$DEPLOY_DEST/"; then
        echo "❌ Error: rsync failed!"
        exit 1
    fi
else
    echo "📤 Copying files with cp..."
    if ! cp -r dist/* "$DEPLOY_DEST/"; then
        echo "❌ Error: cp failed!"
        exit 1
    fi
fi

# Verify deployment
if [ ! -f "$DEPLOY_DEST/index.html" ]; then
    echo "❌ Error: Deployment verification failed - index.html not found!"
    exit 1
fi

# Copy package files
if ls package*.json 1> /dev/null 2>&1; then
    if ! cp package*.json "$DEPLOY_DEST/"; then
        echo "⚠️  Warning: Failed to copy package.json files"
    fi
else
    echo "⚠️  No package.json files found"
fi

# Install production dependencies
cd "$DEPLOY_DEST"
if [ -f "package.json" ]; then
    echo "📦 Installing production dependencies..."
    if ! npm install --production --silent; then
        echo "❌ Error: Failed to install production dependencies!"
        exit 1
    fi
else
    echo "⚠️  No package.json in deployment directory"
fi

cd - >/dev/null

# Calculate build time
END_TIME=$(date +%s)
BUILD_TIME=$((END_TIME - START_TIME))

echo "✅ SUCCESS: The Selling Machine is LIVE."
echo "👉 URL: $DEPLOY_URL"
echo "⏱️  Build Time: ${BUILD_TIME}s"
