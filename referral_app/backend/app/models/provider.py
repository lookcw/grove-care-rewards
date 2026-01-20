import re
from sqlalchemy import Column, String, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, validates
from app.models.base import BaseModel


class Provider(BaseModel):
    """
    Provider model for healthcare professionals or service providers.
    """

    __tablename__ = "providers"

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    fax = Column(String(20), nullable=True)
    npi = Column(String(10), nullable=True, index=True)
    specialty = Column(String(255), nullable=True)

    # Foreign key to Address
    address_id = Column(UUID(as_uuid=True), ForeignKey("addresses.id", ondelete="SET NULL"), nullable=True, index=True)

    # Foreign key to ProviderInstitution
    institution_id = Column(
        UUID(as_uuid=True), ForeignKey("provider_institutions.id", ondelete="SET NULL"), nullable=True, index=True
    )

    # Global/custom provider flag
    global_provider = Column(Boolean, default=True, nullable=False, index=True)

    # Foreign key to User (for custom providers)
    created_by_user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )

    # Foreign key to original Provider (for tracking copies)
    copied_from_provider_id = Column(
        UUID(as_uuid=True), ForeignKey("providers.id", ondelete="SET NULL"), nullable=True, index=True
    )

    # Relationship to Address
    address = relationship("Address", back_populates="providers")

    # Relationship to ProviderInstitution
    institution = relationship("ProviderInstitution", back_populates="providers")

    # Relationship to Referrals (where this provider is the TARGET of the referral)
    referrals = relationship("Referral", foreign_keys="Referral.provider_id", back_populates="provider")

    # Relationship to User (creator)
    created_by = relationship("User", foreign_keys=[created_by_user_id])

    # Relationship to original Provider
    copied_from = relationship("Provider", remote_side="Provider.id", foreign_keys=[copied_from_provider_id])

    def __repr__(self):
        return f"<Provider(id={self.id}, name={self.first_name} {self.last_name})>"

    @property
    def full_name(self):
        """Convenience property for full name."""
        return f"{self.first_name} {self.last_name}"

    @validates("npi")
    def validate_npi(self, key, value):
        """Validate NPI format (National Provider Identifier - exactly 10 digits)."""
        if value is None or value == "":
            return None

        # Strip whitespace
        value = value.strip()

        # Remove any non-digit characters
        digits_only = re.sub(r"[^\d]", "", value)

        # NPI must be exactly 10 digits
        if len(digits_only) != 10:
            raise ValueError(f"NPI must be exactly 10 digits: {value}")

        return digits_only

    @validates("fax")
    def validate_fax(self, key, value):
        """Validate fax number format."""
        if value is None or value == "":
            return None

        # Strip whitespace
        value = value.strip()

        # Remove common phone formatting characters for validation
        digits_only = re.sub(r"[^\d]", "", value)

        # Check if we have a reasonable number of digits (10-11 for US numbers)
        if len(digits_only) < 10 or len(digits_only) > 11:
            raise ValueError(f"Fax number must contain 10-11 digits: {value}")

        return value
