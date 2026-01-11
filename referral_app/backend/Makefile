.PHONY: help ruff ty check format lint all migrate-diff migrate-apply migrate-status migrate-hash migrate-baseline schema-inspect atlas-install migrate-diff-docker migrate-apply-docker install-deps

help:
	@echo "Available targets:"
	@echo ""
	@echo "Code Quality:"
	@echo "  make ruff            - Run ruff linter and formatter"
	@echo "  make ty              - Run ty type checker"
	@echo "  make check           - Run both ty and ruff checks (no formatting)"
	@echo "  make format          - Format code with ruff"
	@echo "  make lint            - Lint code with ruff (no formatting)"
	@echo "  make all             - Run ty check, ruff lint, and ruff format"
	@echo ""
	@echo "Database Migrations (Atlas):"
	@echo "  make atlas-install        - Install Atlas CLI (macOS/Linux)"
	@echo "  make migrate-baseline     - Create initial baseline migration"
	@echo "  make migrate-diff         - Generate new migration from model changes"
	@echo "  make migrate-apply        - Apply pending migrations to database"
	@echo "  make migrate-status       - Check migration status"
	@echo "  make migrate-hash         - Rehash migration directory (fixes integrity issues)"
	@echo "  make schema-inspect       - Inspect current database schema"
	@echo ""
	@echo "Docker Alternatives:"
	@echo "  make migrate-diff-docker  - Generate migration from Docker container"
	@echo "  make migrate-apply-docker - Apply migrations from Docker container"
	@echo "  make install-deps         - Install dependencies from requirements.txt in Docker"

# Run ruff linter and formatter
ruff:
	uv run ruff check .
	uv run ruff format .

# Run ty type checker
ty:
	uv run ty check

# Run both ty and ruff checks (without formatting)
check:
	uv run ty check
	uv run ruff check .

# Format code with ruff
format:
	uv run ruff format .

# Lint code with ruff (no formatting)
lint:
	uv run ruff check .

# Run everything: type check, lint, and format
all:
	uv run ty check
	uv run ruff check .
	uv run ruff format .

# ============================================================================
# Atlas Database Migration Commands
# ============================================================================

# Install Atlas CLI
atlas-install:
	@echo "Installing Atlas CLI..."
	@if command -v brew >/dev/null 2>&1; then \
		echo "Using Homebrew..."; \
		brew install ariga/tap/atlas; \
	else \
		echo "Homebrew not found. Installing via curl..."; \
		curl -sSf https://atlasgo.sh | sh; \
	fi
	@echo "Atlas CLI installed successfully!"
	@atlas version

# Set DATABASE_URL for local development
export DATABASE_URL ?= postgresql://postgres:postgres@localhost:5432/referral_db

# Create initial baseline migration from current schema
migrate-baseline:
	@echo "Creating baseline migration from current database schema..."
	@mkdir -p migrations
	@atlas migrate diff baseline --env local --var DATABASE_URL=$(DATABASE_URL)
	@echo "Baseline migration created successfully!"
	@echo "This captures the current state of your database."

# Generate a new migration based on model changes
migrate-diff:
	@echo "Generating migration from SQLAlchemy model changes..."
	@mkdir -p migrations
	@atlas migrate diff --env local --var DATABASE_URL=$(DATABASE_URL)
	@echo "Migration generated successfully!"
	@echo "Review the migration file in migrations/ before applying."

# Apply pending migrations to the database
migrate-apply:
	@echo "Applying pending migrations..."
	@atlas migrate apply --env local --var DATABASE_URL=$(DATABASE_URL)
	@echo "Migrations applied successfully!"

# Check migration status
migrate-status:
	@echo "Checking migration status..."
	@atlas migrate status --env local --var DATABASE_URL=$(DATABASE_URL)

# Rehash migration directory (useful after manually editing migrations)
migrate-hash:
	@echo "Rehashing migration directory..."
	@atlas migrate hash --force
	@echo "Migration directory rehashed successfully!"

# Inspect current database schema
schema-inspect:
	@echo "Inspecting current database schema..."
	@atlas schema inspect --env local --var DATABASE_URL=$(DATABASE_URL)

# Apply migrations inside Docker container (alternative)
migrate-apply-docker:
	@echo "Applying migrations from Docker container..."
	@docker-compose exec backend atlas migrate apply --env docker

# Generate migration inside Docker container (alternative)
migrate-diff-docker:
	@echo "Generating migration from Docker container..."
	@mkdir -p migrations
	@docker-compose exec backend atlas migrate diff --env docker

# Install dependencies from requirements.txt in Docker container
install-deps:
	@echo "Installing dependencies in Docker container..."
	@docker-compose exec backend pip install -r requirements.txt
	@echo "Dependencies installed successfully!"
