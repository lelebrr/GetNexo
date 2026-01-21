#!/bin/bash
# Clean, Rebuild and Restart Script

set -e

# Function to print step
print_step() {
    echo -e "\n\033[1;34m==================================================\033[0m"
    echo -e "\033[1;33m$1\033[0m"
    echo -e "\033[1;34m==================================================\033[0m"
}

SUDO_PASS="kali"

print_step "Checking for conflicting system services..."
# Stop services that might conflict with Docker ports (80, 443, 5432, 6379, 3000, 8080)
SERVICES="apache2 nginx postgresql redis-server mysql"
for service in $SERVICES; do
    if systemctl is-active --quiet $service; then
        echo "Stopping system service: $service to free up ports..."
        echo "$SUDO_PASS" | sudo -S systemctl stop $service || echo "Failed to stop $service or not found"
        echo "$SUDO_PASS" | sudo -S systemctl disable $service || echo "Failed to disable $service"
    else
        echo "Service $service is not running."
    fi
done

# 1. Stop Docker Services
if [ -f "docker-compose.yml" ]; then
    print_step "Cleaning ALL docker data (volumes, orphans)..."
    docker compose down -v --remove-orphans || echo "Docker down failed or nothing running"
else 
    echo "No docker-compose.yml found!"
fi

# 2. Clean Artifacts
print_step "Cleaning old artifacts (node_modules, dist, builds)..."
# Root
rm -rf node_modules
# Frontend
rm -rf getnexo-site/node_modules
rm -rf getnexo-site/dist
rm -rf getnexo-site/.astro
rm -rf getnexo-site/package-lock.json
# Backend
rm -rf chat-api/node_modules
rm -rf chat-api/package-lock.json

# 3. Reinstall Dependencies (Local)
print_step "Reinstalling dependencies..."

# FRONTEND
echo "--> Installing Frontend dependencies (getnexo-site)..."
cd getnexo-site
npm install

print_step "Building Frontend (getnexo-site)..."
npm run build
if [ $? -ne 0 ]; then
    echo "Frontend build failed! Stopping."
    exit 1
fi
cd ..

# BACKEND
echo "--> Installing Backend dependencies (chat-api)..."
cd chat-api
npm install
cd ..

# ROOT
echo "--> Installing Root dependencies..."
if [ -f "package.json" ]; then
    npm install
fi

# 4. Docker Rebuild & Start
print_step "Rebuilding and Starting Docker Containers..."
# We use --build to force rebuild of images
# We use --force-recreate to ensure fresh containers
# We use sudo for docker if needed (usually fine if user in group but let's be safe if it fails)
if docker info > /dev/null 2>&1; then
    docker compose up -d --build --force-recreate
else
    echo "Docker requires sudo..."
    echo "$SUDO_PASS" | sudo -S docker compose up -d --build --force-recreate
fi

print_step "Waiting for services to stabilize..."
sleep 10

print_step "Status of Containers:"
docker compose ps

print_step "✅ RESTART COMPLETE. ALL SYSTEMS GO."
