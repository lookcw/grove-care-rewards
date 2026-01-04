"""
Models package for the referral application.

This package contains all SQLAlchemy ORM models used by the application.
All models inherit from BaseModel unless they have specific legacy requirements.
"""

from models.base import BaseModel
from models.address import Address
from models.provider_institution import ProviderInstitution
from models.provider import Provider
from models.patient import Patient
from models.user import User
from models.referral import Referral, ReferralStatus

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
]
