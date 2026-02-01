#!/bin/bash
# Clean, Rebuild and Restart Script

set -e

# Configuration
DRY_RUN=${DRY_RUN:-false}
BACKUP_BEFORE_CLEAN=${BACKUP_BEFORE_CLEAN:-false} # Default to false for aggressive clean
WAIT_TIME=${WAIT_TIME:-10}
LOG_FILE="clean_rebuild_$(date +%Y%m%d_%H%M%S).log"
SUDO_PASS="kali" # Hardcoded as per user instruction

# Function to print step
print_step() {
    echo -e "\n\033[1;34m==================================================\033[0m" | tee -a "$LOG_FILE"
    echo -e "\033[1;33m$1\033[0m" | tee -a "$LOG_FILE"
    echo -e "\033[1;34m==================================================\033[0m" | tee -a "$LOG_FILE"
}

# Function to check if directory exists
check_dir() {
    if [ ! -d "$1" ]; then
        echo "Directory $1 does not exist. Skipping..." | tee -a "$LOG_FILE"
        return 1
    fi
    return 0
}

# Function to run command with dry-run support
run_cmd() {
    if [ "$DRY_RUN" = "true" ]; then
        echo "[DRY RUN] Would execute: $*" | tee -a "$LOG_FILE"
    else
        echo "Executing: $*" | tee -a "$LOG_FILE"
        "$@" 2>&1 | tee -a "$LOG_FILE"
    fi
}

print_step "Checking for conflicting system services..."
# Stop services that might conflict with Docker ports (80, 443, 5432, 6379, 3000, 8080)
SERVICES="apache2 nginx postgresql redis-server mysql"
for service in $SERVICES; do
    if systemctl is-active --quiet $service 2>/dev/null; then
        echo "Found running system service: $service"
        if [ "$DRY_RUN" != "true" ]; then
            echo "Stopping and disabling $service..."
            run_cmd echo "$SUDO_PASS" | sudo -S systemctl stop $service
            run_cmd echo "$SUDO_PASS" | sudo -S systemctl disable $service
        else
            echo "[DRY RUN] Would stop $service"
        fi
    else
        echo "Service $service is not running."
    fi
done

# 1. Stop Docker Services
if [ -f "docker-compose.yml" ]; then
    print_step "Cleaning ALL docker data (volumes, orphans)..."
    # echo "$SUDO_PASS" | sudo -S docker compose down -v --remove-orphans || echo "Docker down failed or nothing running"
    docker compose down -v --remove-orphans || echo "Docker down failed or nothing running"
else 
    echo "No docker-compose.yml found!"
fi

# 1.1 Aggressive Docker System Prune
print_step "Performing AGGRESSIVE Docker System Prune..."
if [ "$DRY_RUN" != "true" ]; then
    echo "Removing all unused containers, networks, images (both dangling and unreferenced), and optionally, volumes."
    # echo "$SUDO_PASS" | sudo -S docker system prune -a --volumes -f
    docker system prune -a --volumes -f
else
    echo "[DRY RUN] Would run: docker system prune -a --volumes -f"
fi


# 2. Backup (Optional)
if [ "$BACKUP_BEFORE_CLEAN" = "true" ]; then
    print_step "Creating backup before cleaning..."
    BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
    run_cmd mkdir -p "$BACKUP_DIR"
    run_cmd cp -r getnexo-site/node_modules "$BACKUP_DIR/" 2>/dev/null || echo "No frontend node_modules to backup"
    run_cmd cp -r chat-api/node_modules "$BACKUP_DIR/" 2>/dev/null || echo "No backend node_modules to backup"
    run_cmd cp -r node_modules "$BACKUP_DIR/root_node_modules" 2>/dev/null || echo "No root node_modules to backup"
    echo "Backup created in $BACKUP_DIR" | tee -a "$LOG_FILE"
fi

# 2. Clean Artifacts
print_step "Cleaning old artifacts (node_modules, dist, builds)..."
# Root
if [ -d "node_modules" ]; then
    run_cmd rm -rf node_modules
fi
# Frontend
if [ -d "getnexo-site/node_modules" ]; then
    run_cmd rm -rf getnexo-site/node_modules
fi
if [ -d "getnexo-site/dist" ]; then
    run_cmd rm -rf getnexo-site/dist
fi
if [ -d "getnexo-site/.astro" ]; then
    run_cmd rm -rf getnexo-site/.astro
fi
if [ -f "getnexo-site/package-lock.json" ]; then
    run_cmd rm -f getnexo-site/package-lock.json
fi

# Backend
if [ -d "chat-api/node_modules" ]; then
    run_cmd rm -rf chat-api/node_modules
fi
if [ -f "chat-api/package-lock.json" ]; then
    run_cmd rm -f chat-api/package-lock.json
fi

# 3. Reinstall Dependencies (Local)
print_step "Reinstalling dependencies..."

# FRONTEND
if check_dir "getnexo-site"; then
    echo "--> Installing Frontend dependencies (getnexo-site)..." | tee -a "$LOG_FILE"
    run_cmd cd getnexo-site
    run_cmd npm install
    if [ $? -ne 0 ]; then
        echo "Frontend npm install failed! Stopping." | tee -a "$LOG_FILE"
        exit 1
    fi

    # print_step "Building Frontend (getnexo-site)..."
    # run_cmd npm run build
    # if [ $? -ne 0 ]; then
    #     echo "Frontend build failed! Stopping." | tee -a "$LOG_FILE"
    #     exit 1
    # fi
    run_cmd cd ..
else
    echo "Frontend directory getnexo-site not found. Skipping..." | tee -a "$LOG_FILE"
fi

# BACKEND
if check_dir "chat-api"; then
    echo "--> Installing Backend dependencies (chat-api)..." | tee -a "$LOG_FILE"
    run_cmd cd chat-api
    run_cmd npm install
    if [ $? -ne 0 ]; then
        echo "Backend npm install failed! Stopping." | tee -a "$LOG_FILE"
        exit 1
    fi
    run_cmd cd ..
else
    echo "Backend directory chat-api not found. Skipping..." | tee -a "$LOG_FILE"
fi

# ROOT
echo "--> Installing Root dependencies..." | tee -a "$LOG_FILE"
if [ -f "package.json" ]; then
    run_cmd npm install
    if [ $? -ne 0 ]; then
        echo "Root npm install failed! Stopping." | tee -a "$LOG_FILE"
        exit 1
    fi
else
    echo "No root package.json found. Skipping root dependencies." | tee -a "$LOG_FILE"
fi

# 4. Docker Rebuild & Start
print_step "Checking for port conflicts before starting Docker containers..."

# Check for common port conflicts
PORTS_TO_CHECK=(80 443 5432 6379 3000 8080 8000)
CONFLICTS_FOUND=false

for port in "${PORTS_TO_CHECK[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "Warning: Port $port is already in use!" | tee -a "$LOG_FILE"
        CONFLICTS_FOUND=true
    fi
done

if [ "$CONFLICTS_FOUND" = true ]; then
    echo "Port conflicts detected. Stopping conflicting services..." | tee -a "$LOG_FILE"
    for service in $SERVICES; do
        if systemctl is-active --quiet $service 2>/dev/null; then
            echo "Stopping $service..." | tee -a "$LOG_FILE"
            if [ "$DRY_RUN" != "true" ]; then
                echo "$SUDO_PASS" | sudo -S systemctl stop $service 2>/dev/null || true
            fi
        fi
    done
fi

print_step "Rebuilding and Starting Docker Containers..."
# We use --build to force rebuild of images
# We use --force-recreate to ensure fresh containers
if docker info > /dev/null 2>&1; then
    run_cmd docker compose up -d --build --force-recreate
    if [ $? -ne 0 ]; then
        echo "Docker compose up failed! Stopping." | tee -a "$LOG_FILE"
        exit 1
    fi
else
    echo "Docker requires sudo..." | tee -a "$LOG_FILE"
    echo "$SUDO_PASS" | sudo -S docker compose up -d --build --force-recreate
    if [ $? -ne 0 ]; then
        echo "Docker compose up (with sudo) failed! Stopping." | tee -a "$LOG_FILE"
        exit 1
    fi
fi

print_step "Waiting for services to stabilize..."
echo "Waiting $WAIT_TIME seconds..." | tee -a "$LOG_FILE"
run_cmd sleep "$WAIT_TIME"

print_step "Status of Containers:"
docker compose ps

print_step "✅ RESTART COMPLETE. ALL SYSTEMS GO."
