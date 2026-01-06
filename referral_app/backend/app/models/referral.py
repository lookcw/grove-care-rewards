from enum import Enum as PyEnum
from sqlalchemy import Column, String, ForeignKey, Enum, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
from .base import BaseModel


class ReferralStatus(str, PyEnum):
    """Enum for referral status tracking."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Referral(BaseModel):
    """
    Referral to either a Provider or ProviderInstitution (mutually exclusive).
    """
    __tablename__ = "referrals"

    # Foreign keys
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    provider_id = Column(
        UUID(as_uuid=True),
        ForeignKey("providers.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    provider_institution_id = Column(
        UUID(as_uuid=True),
        ForeignKey("provider_institutions.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    patient_id = Column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )

    # Fields
    status = Column(
        Enum(ReferralStatus, native_enum=False, length=20),
        nullable=False,
        default=ReferralStatus.PENDING,
        index=True
    )
    notes = Column(String(1000), nullable=True)
    referral_date = Column(
        DateTime(timezone=True),
        nullable=False,
        default=func.now(),
        index=True
    )

    # Relationships
    user = relationship("User", back_populates="referrals")
    provider = relationship("Provider", back_populates="referrals")
    provider_institution = relationship("ProviderInstitution", back_populates="referrals")
    patient = relationship("Patient", back_populates="referrals")

    # Constraint: exactly one of provider_id or provider_institution_id
    __table_args__ = (
        CheckConstraint(
            '(provider_id IS NOT NULL)::int + (provider_institution_id IS NOT NULL)::int = 1',
            name='check_exactly_one_referral_target'
        ),
    )

    @validates('provider_id', 'provider_institution_id')
    def validate_referral_target(self, key, value):
        """Application-level validation for mutually exclusive foreign keys."""
        if key == 'provider_id' and value is not None:
            if self.provider_institution_id is not None:
                raise ValueError(
                    "Cannot set provider_id when provider_institution_id is already set."
                )
        elif key == 'provider_institution_id' and value is not None:
            if self.provider_id is not None:
                raise ValueError(
                    "Cannot set provider_institution_id when provider_id is already set."
                )
        return value

    def __repr__(self):
        target = f"provider_id={self.provider_id}" if self.provider_id else f"provider_institution_id={self.provider_institution_id}"
        return f"<Referral(id={self.id}, user_id={self.user_id}, {target}, status={self.status})>"

    @property
    def referral_target_type(self):
        """Returns 'provider' or 'provider_institution'."""
        if self.provider_id:
            return "provider"
        elif self.provider_institution_id:
            return "provider_institution"
        return None

    @property
    def referral_target(self):
        """Returns the actual provider or institution object."""
        return self.provider if self.provider_id else self.provider_institution
