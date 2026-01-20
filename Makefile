# Makefile for Use Nexo Enterprise

.PHONY: up down restart logs backup secure tune launch clean

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
