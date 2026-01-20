.PHONY: help build up down restart logs seed clean db-reset deploy-staging

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  make build       - Build all Docker containers"
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make logs        - View logs from all services"
	@echo "  make logs-backend - View backend logs"
	@echo "  make logs-frontend - View frontend logs"
	@echo "  make logs-db     - View database logs"
	@echo "  make seed        - Seed database with sample data"
	@echo "  make db-reset    - Reset database and reseed"
	@echo "  make shell-backend - Open shell in backend container"
	@echo "  make shell-db    - Open psql shell in database"
	@echo "  make clean       - Stop and remove all containers, volumes"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy-staging - Deploy to App Engine staging"

# Build containers
build:
	docker-compose build

# Start services
up:
	docker-compose up -d

# Stop services
down:
	docker-compose down

# Restart services
restart:
	docker-compose restart

# View logs
logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f postgres

rebuild-backend:
	docker-compose down backend
	docker-compose build backend
	docker-compose up -d backend

# Seed database
seed:
	docker-compose exec backend python seed_data.py

# Reset database and reseed
db-reset:
	@echo "Resetting database..."
	docker-compose down
	docker volume rm referral_app_postgres_data || true
	docker-compose up -d
	@echo "Waiting for services to be ready..."
	sleep 10
	docker-compose exec backend python seed_data.py

# Open shell in backend container
shell-backend:
	docker-compose exec backend /bin/sh

# Open psql shell in database
shell-db:
	docker-compose exec postgres psql -U postgres -d referral_db

# Clean everything
clean:
	docker-compose down -v
	docker system prune -f

# ============================================================================
# Deployment Commands
# ============================================================================

GCP_PROJECT := grove-health-staging

# Deploy to staging (builds frontend, copies to backend/static, deploys to App Engine)
deploy-staging:
	@echo "🏗️  Building frontend..."
	cd frontend && npm run build
	@echo "📋 Copying frontend build to backend/static/..."
	rm -rf backend/static
	mkdir -p backend/static
	cp -r frontend/dist/* backend/static/
	@echo "🚀 Deploying to App Engine (staging)..."
	cd backend && gcloud app deploy app.yaml --project=$(GCP_PROJECT) --quiet
	@echo "✅ Deployment complete!"
	@echo "🌐 App URL: https://grove-health-staging.uc.r.appspot.com"
