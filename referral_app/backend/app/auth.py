"""
Authentication configuration using FastAPI Users.
"""

import os
import uuid
from typing import Optional

from fastapi import Depends, Request
from fastapi_users import BaseUserManager, FastAPIUsers, UUIDIDMixin
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.database import get_db
from app.gmail_service import send_password_reset_email, send_verification_email

# Secret key for JWT - In production, use environment variable
def get_jwt_secret():
    """Get JWT secret based on environment."""
    env = os.getenv("ENVIRONMENT", "local")

    if env in ["staging", "production"]:
        from google.cloud import secretmanager
        client = secretmanager.SecretManagerServiceClient()
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        secret_name = f"projects/{project_id}/secrets/jwt-secret/versions/latest"
        response = client.access_secret_version(request={"name": secret_name})
        return response.payload.data.decode("UTF-8")
    else:
        return os.getenv("JWT_SECRET", "YOUR_SECRET_KEY_CHANGE_THIS_IN_PRODUCTION")

SECRET = get_jwt_secret()


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    """User manager for handling user operations."""
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        """Called after successful user registration."""
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        """Called after user requests password reset."""
        print(f"User {user.id} has forgot their password. Reset token: {token}")
        await send_password_reset_email(user.email, token)

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        """Called after user requests email verification."""
        print(f"Verification requested for user {user.id}. Verification token: {token}")
        await send_verification_email(user.email, token)


async def get_user_db(session: AsyncSession = Depends(get_db)):
    """Dependency to get user database."""
    yield SQLAlchemyUserDatabase(session, User)


async def get_user_manager(user_db=Depends(get_user_db)):
    """Dependency to get user manager."""
    yield UserManager(user_db)


# Bearer token transport
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")


def get_jwt_strategy() -> JWTStrategy:
    """Get JWT authentication strategy."""
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)


# Authentication backend
auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

# FastAPI Users instance
fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager,
    [auth_backend],
)

# Dependency to get current active user
current_active_user = fastapi_users.current_user(active=True)
