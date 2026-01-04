import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from typing import AsyncGenerator

def get_database_url():
    """Get database URL based on environment."""
    env = os.getenv("ENVIRONMENT", "local")

    if env in ["staging", "production"]:
        # In App Engine, use Secret Manager
        from google.cloud import secretmanager
        client = secretmanager.SecretManagerServiceClient()
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        secret_name = f"projects/{project_id}/secrets/database-url/versions/latest"
        response = client.access_secret_version(request={"name": secret_name})
        return response.payload.data.decode("UTF-8")
    else:
        # Local development
        DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@postgres:5432/referral_db")
        return DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

ASYNC_DATABASE_URL = get_database_url()

# Create async SQLAlchemy engine
engine = create_async_engine(ASYNC_DATABASE_URL, echo=False)

# Create async SessionLocal class
AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Create Base class for declarative models
Base = declarative_base()

# Dependency to get async database session
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
