import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from typing import AsyncGenerator

def get_database_engine():
    """Create database engine based on environment."""
    env = os.getenv("ENVIRONMENT", "local")

    if env in ["staging", "production"]:
        # Use Cloud SQL Python Connector for App Engine
        from google.cloud.sql.connector import Connector
        import asyncpg

        # Get database config from Secret Manager
        from google.cloud import secretmanager
        client = secretmanager.SecretManagerServiceClient()
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")

        # Get connection name and credentials
        connector = Connector()

        async def getconn():
            conn = await connector.connect_async(
                "grove-health-staging:us-central1:referral-app-dev-db",
                "asyncpg",
                user="referral_user",
                password="WTw7KLx/uxaL7qTiBCBL0u72SYFKLIL8OprORiSAsV8=",
                db="referral_db"
            )
            return conn

        # Create engine with Cloud SQL connector
        return create_async_engine(
            "postgresql+asyncpg://",
            async_creator=getconn,
            echo=False
        )
    else:
        # Local development
        DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@postgres:5432/referral_db")
        ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
        return create_async_engine(ASYNC_DATABASE_URL, echo=False)

# Create async SQLAlchemy engine
engine = get_database_engine()

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
