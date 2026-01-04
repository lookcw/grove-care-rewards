# Referral App - Hello World

A minimal full-stack application with FastAPI + SQLAlchemy + PostgreSQL backend and React + Vite frontend, orchestrated with Docker Compose.

## Features

- **Backend**: FastAPI with SQLAlchemy ORM
- **Database**: PostgreSQL 15
- **Frontend**: React 18 + TypeScript + Vite
- **Infrastructure**: Docker Compose for easy development

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone the repository and navigate to the project directory:
   ```bash
   cd referral_app
   ```

2. (Optional) Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

3. Start all services:
   ```bash
   docker-compose up
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## API Endpoints

- `GET /` - Health check endpoint
- `GET /health` - Database connectivity check
- `GET /docs` - Swagger UI API documentation

## Development

The application runs in development mode with hot-reload enabled:

- **Backend**: Changes to Python files in `backend/app/` will automatically reload the server
- **Frontend**: Changes to files in `frontend/src/` will trigger hot module replacement

## Database Migrations with Atlas

This project uses [Atlas](https://atlasgo.io/) for database schema migrations. Atlas provides a modern, declarative approach to managing database schemas.

### Installing Atlas CLI

Install the Atlas CLI tool:

```bash
# macOS
brew install ariga/tap/atlas

# Linux
curl -sSf https://atlasgo.sh | sh

# Windows
# Download from https://atlasgo.io/getting-started#installation
```

### Common Atlas Commands

Navigate to the `backend/` directory for all Atlas commands:

```bash
cd backend
```

**Generate a new migration** (compares SQLAlchemy models with current database):
```bash
atlas migrate diff --env docker migration_name
```

**Apply pending migrations** to the database:
```bash
atlas migrate apply --env docker
```

**Inspect current database schema**:
```bash
atlas schema inspect --env docker
```

**Validate migrations**:
```bash
atlas migrate validate --env docker
```

**View migration status**:
```bash
atlas migrate status --env docker
```

### How It Works

- SQLAlchemy models in `backend/app/models.py` define your schema
- `atlas_loader.py` exports the schema from SQLAlchemy models
- `atlas.hcl` configures Atlas environments (local, docker)
- Atlas generates migration files in `backend/migrations/`

### Workflow for Schema Changes

1. Update your SQLAlchemy models in `backend/app/models.py`
2. Generate a migration: `atlas migrate diff --env docker add_new_field`
3. Review the generated migration in `backend/migrations/`
4. Apply the migration: `atlas migrate apply --env docker`

## Project Structure

```
referral_app/
├── docker-compose.yml      # Docker orchestration
├── backend/               # FastAPI application
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py       # FastAPI routes
│       ├── database.py   # Database connection
│       └── models.py     # SQLAlchemy models
└── frontend/             # React application
    ├── Dockerfile
    ├── package.json
    └── src/
        └── App.tsx       # Main component
```

## Stopping the Application

```bash
docker-compose down
```

To remove volumes as well:
```bash
docker-compose down -v
```
