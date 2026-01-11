# Database Migrations with Atlas

This project uses [Atlas](https://atlasgo.io/) for database schema migrations with SQLAlchemy.

## Prerequisites

Install Atlas CLI:
```bash
make atlas-install
```

Or manually:
- **macOS/Linux (Homebrew)**: `brew install ariga/tap/atlas`
- **Manual install**: `curl -sSf https://atlasgo.sh | sh`

## Quick Start

### 1. First Time Setup (Existing Database)

If you already have a database with tables, create a baseline migration:

```bash
make migrate-baseline
```

This captures your current database state as the starting point for future migrations.

### 2. Making Model Changes

When you modify SQLAlchemy models (add/remove fields, create new models):

1. **Generate migration**:
   ```bash
   make migrate-diff
   ```

2. **Review the generated migration** in `migrations/` directory

3. **Apply the migration**:
   ```bash
   make migrate-apply
   ```

### 3. Check Migration Status

```bash
make migrate-status
```

## Common Commands

| Command | Description |
|---------|-------------|
| `make migrate-diff` | Generate new migration from model changes |
| `make migrate-apply` | Apply pending migrations |
| `make migrate-status` | Check which migrations are applied |
| `make migrate-hash` | Rehash migrations (fixes integrity errors) |
| `make schema-inspect` | View current database schema |

## Docker Commands

If you prefer running Atlas from within Docker:

```bash
make migrate-diff-docker    # Generate migration
make migrate-apply-docker   # Apply migration
```

## Typical Workflow

1. **Modify your SQLAlchemy models** in `app/models/`
2. **Generate migration**: `make migrate-diff`
3. **Review migration file** in `migrations/` directory
4. **Apply migration**: `make migrate-apply`
5. **Commit migration files** to git

## Fixing Migration Issues

### "Migration directory hash mismatch"

If you manually edited migrations or had conflicts:

```bash
make migrate-hash
```

### Starting Fresh

If you need to regenerate migrations from scratch:

1. Delete the `migrations/` directory
2. Drop and recreate the database schema
3. Run `make migrate-baseline` to create initial migration

## Configuration

Atlas configuration is in `atlas.hcl` with two environments:

- **local**: For development on host machine
- **docker**: For development inside Docker container

The SQLAlchemy schema is loaded via `atlas_loader.py` which imports all models.

## Environment Variables

Set `DATABASE_URL` to override the default:

```bash
export DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
make migrate-diff
```

Default: `postgresql://postgres:postgres@localhost:5432/referral_db`

## Troubleshooting

### "No such file or directory: migrations"

Run `mkdir migrations` or the make commands will create it automatically.

### "Connection refused"

Make sure your PostgreSQL container is running:
```bash
docker-compose up postgres
```

### Models not detected

Ensure all models are imported in `atlas_loader.py`:
```python
from app.models import Address, Provider, ProviderInstitution, User, Referral, Patient
```

## Learn More

- [Atlas Documentation](https://atlasgo.io/getting-started)
- [Atlas with SQLAlchemy](https://atlasgo.io/guides/orms/sqlalchemy)
- [Migration Directory](https://atlasgo.io/concepts/migration-directory)
