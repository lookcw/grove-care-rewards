from enum import Enum as PyEnum
from sqlalchemy import Column, String, ForeignKey, Enum, DateTime, Text, Float
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
from app.models.base import BaseModel


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
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=True, index=True)

    # Referring provider - who CREATED/INITIATED the referral
    referring_provider_id = Column(
        UUID(as_uuid=True), ForeignKey("providers.id", ondelete="SET NULL"), nullable=True, index=True
    )

    # Target provider/institution - where the patient is being referred TO
    provider_id = Column(UUID(as_uuid=True), ForeignKey("providers.id", ondelete="SET NULL"), nullable=True, index=True)
    provider_institution_id = Column(
        UUID(as_uuid=True), ForeignKey("provider_institutions.id", ondelete="SET NULL"), nullable=True, index=True
    )

    # Core fields
    status = Column(
        Enum(ReferralStatus, native_enum=False, length=20), nullable=False, default=ReferralStatus.PENDING, index=True
    )
    notes = Column(String(1000), nullable=True)  # User-added notes
    referral_date = Column(DateTime(timezone=True), nullable=False, default=func.now(), index=True)
    appointment_timeframe = Column(DateTime(timezone=True), nullable=True)

    # Clinical fields (extracted from document)
    diagnosis_codes = Column(JSON, nullable=True)  # List of ICD-10 codes
    diagnosis_descriptions = Column(JSON, nullable=True)  # List of diagnosis descriptions
    reason_for_referral = Column(Text, nullable=True)
    clinical_notes = Column(Text, nullable=True)  # Clinical notes from document
    specialty_requested = Column(String(255), nullable=True)
    urgency = Column(String(50), nullable=True)
    orders_count = Column(String(50), nullable=True)
    schedule_within = Column(String(100), nullable=True)

    # Document metadata (from AI extraction)
    signed_by = Column(String(255), nullable=True)
    confidence_score = Column(Float, nullable=True)  # AI extraction confidence (0.0-1.0)
    raw_text = Column(Text, nullable=True)  # Full OCR text from document
    document_file_path = Column(String(500), nullable=True)  # GCS path or local path to PDF
    document_processed_at = Column(DateTime(timezone=True), nullable=True)  # When AI extraction occurred

    # Relationships
    user = relationship("User", back_populates="referrals")
    patient = relationship("Patient", back_populates="referrals")
    referring_provider = relationship("Provider", foreign_keys=[referring_provider_id])
    provider = relationship("Provider", foreign_keys=[provider_id], back_populates="referrals")
    provider_institution = relationship("ProviderInstitution", back_populates="referrals")

    @validates("provider_id", "provider_institution_id")
    def validate_referral_target(self, key, value):
        """Application-level validation for mutually exclusive foreign keys.

        Allows three valid states:
        - Both None (open referral)
        - provider_id set, provider_institution_id None (provider referral)
        - provider_institution_id set, provider_id None (institution referral)
        - Prevents both from being set simultaneously
        """
        if key == "provider_id" and value is not None:
            if self.provider_institution_id is not None:
                raise ValueError("Cannot set provider_id when provider_institution_id is already set.")
        elif key == "provider_institution_id" and value is not None:
            if self.provider_id is not None:
                raise ValueError("Cannot set provider_institution_id when provider_id is already set.")
        return value

    def __repr__(self):
        target = (
            f"provider_id={self.provider_id}"
            if self.provider_id
            else f"provider_institution_id={self.provider_institution_id}"
        )
        return f"<Referral(id={self.id}, user_id={self.user_id}, {target}, status={self.status})>"

    @property
    def referral_target_type(self):
        """Returns 'provider', 'provider_institution', or 'open'."""
        if self.provider_id:
            return "provider"
        elif self.provider_institution_id:
            return "provider_institution"
        return "open"

    @property
    def referral_target(self):
        """Returns the actual provider or institution object."""
        return self.provider if self.provider_id else self.provider_institution
