"""
Script to make a user an admin.
Usage: python make_admin.py <email>
"""

import asyncio
import sys
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models.user import User


async def make_user_admin(email: str):
    """Set is_admin=True for a user with the given email."""
    async with AsyncSessionLocal() as session:
        # Find user by email
        result = await session.execute(
            select(User).filter(User.email == email)
        )
        user = result.scalar_one_or_none()

        if not user:
            print(f"❌ User with email '{email}' not found")
            return False

        if user.is_admin:
            print(f"✓ User '{email}' is already an admin")
            return True

        # Set admin flag
        user.is_admin = True
        await session.commit()

        print(f"✓ Successfully made '{email}' an admin")
        return True


async def main():
    if len(sys.argv) < 2:
        email = "lookwchristopher@gmail.com"
        print(f"No email provided, using default: {email}")
    else:
        email = sys.argv[1]

    await make_user_admin(email)


if __name__ == "__main__":
    asyncio.run(main())
