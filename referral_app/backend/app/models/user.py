from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class User(SQLAlchemyBaseUserTableUUID, Base):
    """User model representing healthcare professionals who can make referrals."""
    __tablename__ = "users"

    # Custom fields for our application
    phone_number = Column(String(20), nullable=True)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    npi = Column(String(10), nullable=True, index=True)
    is_admin = Column(Boolean, default=False, nullable=False)

    # Relationship to referrals
    referrals = relationship("Referral", back_populates="user")

    # Relationship to provider network
    provider_networks = relationship("UserProviderNetwork", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"

    @property
    def full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.email
