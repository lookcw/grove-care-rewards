import re
from datetime import date
from sqlalchemy import Column, String, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, validates
from .base import BaseModel


class Patient(BaseModel):
    """
    Patient model for storing patient demographic and medical information.
    """
    __tablename__ = "patients"

    # Core demographic fields
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True, index=True)
    date_of_birth = Column(Date, nullable=False, index=True)

    # Medical information fields
    insurance_provider = Column(String(255), nullable=True)
    insurance_policy_number = Column(String(100), nullable=True, index=True)
    medical_record_number = Column(String(100), nullable=True, unique=True, index=True)

    # Foreign key to Address
    address_id = Column(
        UUID(as_uuid=True),
        ForeignKey("addresses.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    # Relationships
    address = relationship("Address", back_populates="patients")
    referrals = relationship("Referral", back_populates="patient")

    def __repr__(self):
        return f"<Patient(id={self.id}, name={self.full_name}, mrn={self.medical_record_number})>"

    @property
    def full_name(self):
        """Convenience property for full name."""
        return f"{self.first_name} {self.last_name}"

    @property
    def age(self):
        """Calculate age from date of birth."""
        if not self.date_of_birth:
            return None
        today = date.today()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )

    @property
    def has_insurance(self):
        """Check if patient has insurance information."""
        return bool(self.insurance_provider and self.insurance_policy_number)

    @validates('email')
    def validate_email(self, key, value):
        """Validate email format if provided."""
        if value is None or value == '':
            return None

        # Simple email validation pattern
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value):
            raise ValueError(f"Invalid email format: {value}")

        return value.lower().strip()

    @validates('phone')
    def validate_phone(self, key, value):
        """Validate and normalize phone format if provided."""
        if value is None or value == '':
            return None

        # Strip whitespace
        value = value.strip()

        # Remove common phone formatting characters for validation
        digits_only = re.sub(r'[^\d]', '', value)

        # Check if we have a reasonable number of digits (10-11 for US numbers)
        if len(digits_only) < 10 or len(digits_only) > 11:
            raise ValueError(f"Phone number must contain 10-11 digits: {value}")

        return value

    @validates('date_of_birth')
    def validate_date_of_birth(self, key, value):
        """Validate date of birth is not in the future and is reasonable."""
        if value is None:
            raise ValueError("Date of birth is required")

        today = date.today()

        # Check if date is in the future
        if value > today:
            raise ValueError("Date of birth cannot be in the future")

        # Check if age is reasonable (not older than 120 years)
        age_years = today.year - value.year
        if age_years > 120:
            raise ValueError("Date of birth indicates unreasonable age (>120 years)")

        return value

    @validates('medical_record_number')
    def validate_medical_record_number(self, key, value):
        """Validate medical record number format if provided."""
        if value is None or value == '':
            return None

        # Strip whitespace
        value = value.strip()

        # Check length
        if len(value) < 3 or len(value) > 100:
            raise ValueError("Medical record number must be between 3 and 100 characters")

        # Check alphanumeric (allow hyphens and underscores)
        if not re.match(r'^[a-zA-Z0-9_-]+$', value):
            raise ValueError("Medical record number must contain only letters, numbers, hyphens, and underscores")

        return value.upper()
