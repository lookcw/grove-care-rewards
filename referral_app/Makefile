.PHONY: help build up down restart logs seed clean db-reset

# Default target
help:
	@echo "Available commands:"
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
