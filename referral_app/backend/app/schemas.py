"""
Pydantic schemas for API request/response validation.
"""

from fastapi_users import schemas
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import date, datetime
import uuid


class UserRead(schemas.BaseUser[uuid.UUID]):
    """Schema for reading user data (response)."""
    phone_number: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    npi: Optional[str] = None


class UserCreate(schemas.BaseUserCreate):
    """Schema for creating a new user (registration)."""
    phone_number: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    npi: Optional[str] = None


class UserUpdate(schemas.BaseUserUpdate):
    """Schema for updating user data."""
    phone_number: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    npi: Optional[str] = None


# Patient schemas

class PatientCreate(BaseModel):
    """Schema for creating a new patient."""
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = Field(None, max_length=255)
    date_of_birth: date
    insurance_provider: Optional[str] = Field(None, max_length=255)
    insurance_policy_number: Optional[str] = Field(None, max_length=100)
    medical_record_number: Optional[str] = Field(None, max_length=100)
    address_id: Optional[uuid.UUID] = None


class PatientRead(BaseModel):
    """Schema for reading patient data (response)."""
    id: uuid.UUID
    first_name: str
    last_name: str
    phone: Optional[str]
    email: Optional[str]
    date_of_birth: date
    insurance_provider: Optional[str]
    insurance_policy_number: Optional[str]
    medical_record_number: Optional[str]
    address_id: Optional[uuid.UUID]
    datetime_created: datetime
    datetime_updated: datetime

    class Config:
        from_attributes = True


class PatientUpdate(BaseModel):
    """Schema for updating patient data."""
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = Field(None, max_length=255)
    date_of_birth: Optional[date] = None
    insurance_provider: Optional[str] = Field(None, max_length=255)
    insurance_policy_number: Optional[str] = Field(None, max_length=100)
    medical_record_number: Optional[str] = Field(None, max_length=100)
    address_id: Optional[uuid.UUID] = None


# Referral schemas

class ReferralCreate(BaseModel):
    """Schema for creating a new referral."""
    # Patient (mutually exclusive)
    patient_id: Optional[uuid.UUID] = None
    patient_data: Optional[PatientCreate] = None

    # Referral target (mutually exclusive)
    referral_target_type: str = Field(..., pattern="^(provider|provider_institution)$")
    provider_id: Optional[uuid.UUID] = None
    provider_institution_id: Optional[uuid.UUID] = None

    # Metadata
    notes: Optional[str] = None

    @validator('patient_id')
    def validate_patient_selection(cls, v, values):
        """Ensure exactly one of patient_id or patient_data is provided."""
        if v is None and values.get('patient_data') is None:
            raise ValueError("Either patient_id or patient_data must be provided")
        if v is not None and values.get('patient_data') is not None:
            raise ValueError("Cannot provide both patient_id and patient_data")
        return v

    @validator('provider_institution_id')
    def validate_referral_target(cls, v, values):
        """Ensure exactly one referral target is provided."""
        referral_type = values.get('referral_target_type')
        provider_id = values.get('provider_id')

        if referral_type == 'provider' and provider_id is None:
            raise ValueError("provider_id required when referral_target_type is 'provider'")
        if referral_type == 'provider_institution' and v is None:
            raise ValueError("provider_institution_id required when referral_target_type is 'provider_institution'")

        return v


class ReferralRead(BaseModel):
    """Schema for reading referral data (response)."""
    id: uuid.UUID
    user_id: uuid.UUID
    patient_id: uuid.UUID
    provider_id: Optional[uuid.UUID]
    provider_institution_id: Optional[uuid.UUID]
    status: str
    notes: Optional[str]
    referral_date: datetime

    class Config:
        from_attributes = True
