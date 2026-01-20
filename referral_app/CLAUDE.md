# Grove Care Rewards - Development Guide

## Deployment

### Staging Deployment
Deploy to staging:

```bash
make deploy-staging
```

**What happens:**
1. Builds frontend: `cd frontend && npm run build`
2. Copies build to `backend/static/`
3. Deploys to App Engine: `gcloud app deploy backend/app.yaml`

App Engine serves both:
- Frontend static files from `backend/static/` (see handlers in `app.yaml`)
- Backend API at `/api/*` routes

**Prerequisites:**
- Authenticated with gcloud: `gcloud auth login`
- Correct GCP project: `gcloud config set project grove-health-staging`
- App Engine and Cloud SQL permissions

**App URL:** https://grove-health-staging.uc.r.appspot.com

## Database Migrations
This project uses **Atlas** (atlasgo.io) for declarative schema migrations, not Alembic.

### ⚠️ CRITICAL RULE: NEVER Manually Edit SQL Migrations
**NEVER manually write or edit SQL migration files.** Always use Atlas to generate migrations from model changes.

Manual SQL editing leads to:
- Checksum mismatches
- Inconsistent database states
- Failed migrations
- Hard-to-debug issues

**Always let Atlas generate migrations automatically.**

### Atlas Commands
- `make migrate-diff` - Generate migration from model changes
- `make migrate-apply` - Apply pending migrations
- `make migrate-status` - Check migration status
- `make migrate-baseline` - Create initial baseline
- `make schema-inspect` - View current schema

### Migration Workflow
1. Modify SQLAlchemy models in `backend/app/models/`
2. **Rebuild Docker container** if working with Docker:
   ```bash
   docker-compose build backend
   docker-compose up -d backend
   ```
3. Run `make migrate-diff` (or `docker exec referral_backend atlas migrate diff --env docker`)
4. Review generated migration in `backend/migrations/`
5. Run `make migrate-apply` to apply changes
6. Commit migration files with your code changes

### Docker Migration Commands
When using Docker, migrations must run inside the container:
```bash
# Generate migration
docker exec referral_backend bash -c "cd /app && atlas migrate diff --env docker"

# Apply migration
docker exec referral_backend bash -c "cd /app && atlas migrate apply --env docker"

# Check status
docker exec referral_backend bash -c "cd /app && atlas migrate status --env docker"
```

**Important:** After modifying models, rebuild the backend container before generating migrations.

Configuration: `backend/atlas.hcl`
Documentation: `backend/MIGRATIONS.md`

## Package Management
This project uses **uv** for Python dependency management.

### Setup
```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies
cd backend
uv sync
```

### Common Commands
- `uv sync` - Install/update dependencies from pyproject.toml
- `uv add <package>` - Add new dependency
- `uv remove <package>` - Remove dependency
- `uv lock` - Update uv.lock file
- `uv run <command>` - Run command in virtual environment

## Code Quality & Type Checking

This project uses **ruff** for linting/formatting and **ty** for type checking.

### Type Checking with ty

Run type checking:
```bash
cd backend
make ty              # Run ty type checker
make check           # Run both ty and ruff (no formatting)
make all             # Run ty, ruff lint, and ruff format
```

Or directly with uv:
```bash
uv run ty check
```

Configuration: `backend/pyproject.toml` under `[tool.ty]`

### Linting & Formatting with ruff

```bash
make ruff            # Lint and format
make format          # Format only
make lint            # Lint only (no formatting)
```

### Pre-commit Workflow
Before committing code, run:
```bash
make all             # Type check, lint, and format
```

## Code Organization

### Schema Files
Keep Pydantic schemas next to their related service files, not in the global `schemas.py`.

**Pattern:**
- ✅ `backend/app/documo_service.py` + `backend/app/documo_schemas.py`
- ✅ `backend/app/gmail_service.py` + `backend/app/gmail_schemas.py` (if needed)
- ❌ Don't add service-specific schemas to `backend/app/schemas.py`

**When to use global `schemas.py`:**
- Core domain models (User, Patient, Referral, Provider, etc.)
- Schemas used across multiple services
- API request/response schemas for main endpoints

**When to create separate schema files:**
- External API integrations (webhooks, third-party services)
- Service-specific request/response models
- Complex nested schemas for a specific feature
