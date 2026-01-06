"""
Models package for the referral application.

This package contains all SQLAlchemy ORM models used by the application.
All models inherit from BaseModel unless they have specific legacy requirements.
"""

from .base import BaseModel
from .address import Address
from .provider_institution import ProviderInstitution
from .provider import Provider
from .patient import Patient
from .user import User
from .referral import Referral, ReferralStatus

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
