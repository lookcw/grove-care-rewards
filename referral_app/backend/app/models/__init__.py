"""
Models package for the referral application.

This package contains all SQLAlchemy ORM models used by the application.
All models inherit from BaseModel unless they have specific legacy requirements.
"""

from app.models.base import BaseModel
from app.models.address import Address
from app.models.provider_institution import ProviderInstitution
from app.models.provider import Provider
from app.models.patient import Patient
from app.models.user import User
from app.models.referral import Referral, ReferralStatus
from app.models.user_provider_network import UserProviderNetwork

# Export all models for easy importing
__all__ = [
    "BaseModel",
    "Address",
    "ProviderInstitution",
    "Provider",
    "Patient",
    "User",
    "Referral",
    "ReferralStatus",
    "UserProviderNetwork",
]
