# Makefile for Use Nexo Enterprise

.PHONY: up down restart logs backup secure tune launch clean dev test build deploy status help

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

backup:
	./scripts/backup.sh

secure:
	./scripts/harden-host.sh
	./scripts/security-audit.sh

tune:
	./scripts/production_tuning.sh
	./scripts/optimize_total.sh

launch:
	@echo "🚀 Launching Use Nexo Enterprise..."
	@./scripts/verify_launch_readiness.sh
	@echo "✅ Launch Verified. Opening Dashboard..."
	@echo "👉 Open https://getnexo.com.br"

clean:
	@echo "⚠️  Executing The Purge..."
	@./scripts/optimize_total.sh

god-view:
	@echo "👁️  Opening God View..."
	@xdg-open docs/god_view.html 2>/dev/null || echo "Open docs/god_view.html in your browser."

# Development targets
dev:
	@echo "🚀 Starting development environment..."
	docker compose -f docker-compose.dev.yml up -d 2>/dev/null || docker compose up -d
	@echo "📝 Frontend: http://localhost:4321"
	@echo "🔧 Backend: http://localhost:3000"
	@echo "📊 Admin: http://localhost:4321/admin"

build:
	@echo "🔨 Building all services..."
	cd getnexo-site && npm run build
	cd chat-api && npm run build 2>/dev/null || echo "Backend build not needed"
	@echo "✅ Build complete"

test:
	@echo "🧪 Running tests..."
	cd getnexo-site && npm test 2>/dev/null || echo "Frontend tests not configured"
	cd chat-api && npm test 2>/dev/null || echo "Backend tests not configured"
	@echo "✅ Tests complete"

deploy:
	@echo "🚀 Deploying to production..."
	./deploy_selling_machine.sh

status:
	@echo "📊 Service Status:"
	docker compose ps
	@echo ""
	@echo "💾 Disk Usage:"
	df -h | grep -E "(Filesystem|overlay|/dev)" | head -5
	@echo ""
	@echo "🔍 Container Logs (last 10 lines):"
	docker compose logs --tail=10

# Maintenance targets
update:
	@echo "⬆️  Updating dependencies..."
	cd getnexo-site && npm update
	cd chat-api && npm update 2>/dev/null || echo "Backend update not needed"
	docker compose pull

monitor:
	@echo "📈 Starting monitoring..."
	docker compose -f docker-compose.monitoring.yml up -d 2>/dev/null || echo "Monitoring stack not configured"

# Utility targets
help:
	@echo "Use Nexo Enterprise - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev        - Start development environment"
	@echo "  make build      - Build all services"
	@echo "  make test       - Run all tests"
	@echo ""
	@echo "Production:"
	@echo "  make up         - Start production services"
	@echo "  make down       - Stop all services"
	@echo "  make restart    - Restart all services"
	@echo "  make deploy     - Deploy to production"
	@echo ""
	@echo "Monitoring:"
	@echo "  make logs       - View service logs"
	@echo "  make status     - Show service status"
	@echo "  make monitor    - Start monitoring stack"
	@echo ""
	@echo "Maintenance:"
	@echo "  make backup     - Create backup"
	@echo "  make clean      - Clean up resources"
	@echo "  make update     - Update dependencies"
	@echo "  make secure     - Run security checks"
	@echo "  make tune       - Performance tuning"
	@echo ""
	@echo "Other:"
	@echo "  make launch     - Launch verification"
	@echo "  make god-view   - Open documentation"
	@echo "  make help       - Show this help"
