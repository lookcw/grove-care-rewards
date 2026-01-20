import re
from sqlalchemy import Boolean, Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, validates

from .base import BaseModel


class Insurance(BaseModel):
    """
    Insurance model for storing patient insurance information.
    Supports both primary and secondary insurance.
    """

    __tablename__ = "insurances"

    # Foreign key to Patient
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)

    # Insurance details
    plan_name = Column(String(255), nullable=True)
    policy_number = Column(String(100), nullable=True, index=True)
    group_number = Column(String(100), nullable=True)
    subscriber_name = Column(String(255), nullable=True)
    is_primary = Column(Boolean, default=True, nullable=False, index=True)

    # Relationship to Patient
    patient = relationship("Patient", back_populates="insurances")

    def __repr__(self):
        insurance_type = "Primary" if self.is_primary else "Secondary"
        return f"<Insurance(id={self.id}, patient_id={self.patient_id}, {insurance_type}, plan={self.plan_name})>"

    @validates("policy_number")
    def validate_policy_number(self, key, value):
        """Validate policy number format if provided."""
        if value is None or value == "":
            return None

        # Strip whitespace
        value = value.strip()

        # Check length (reasonable range for policy numbers)
        if len(value) < 3 or len(value) > 100:
            raise ValueError("Policy number must be between 3 and 100 characters")

        # Allow alphanumeric with common separators (hyphens, spaces)
        if not re.match(r"^[a-zA-Z0-9\s\-]+$", value):
            raise ValueError("Policy number must contain only letters, numbers, hyphens, and spaces")

        return value.upper()
