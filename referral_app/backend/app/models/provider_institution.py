from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class ProviderInstitution(BaseModel):
    """
    ProviderInstitution model for healthcare institutions/organizations.
    Examples: Pivot PT, Kaiser Permanente, etc.

    Can be either:
    - Global institutions (created_by_user_id = NULL): visible to all users
    - User-owned institutions (created_by_user_id = user UUID): private to that user
    """

    __tablename__ = "provider_institutions"

    name = Column(String(255), nullable=False, index=True)
    type = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    website = Column(String(500), nullable=True)

    # Foreign key to Address
    address_id = Column(UUID(as_uuid=True), ForeignKey("addresses.id", ondelete="SET NULL"), nullable=True, index=True)

    # Foreign key to User (for user-owned institutions)
    created_by_user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )

    # Relationship to Address
    address = relationship("Address", back_populates="provider_institutions")

    # Relationship to User (for user-owned institutions)
    created_by = relationship("User", foreign_keys=[created_by_user_id], back_populates="my_institution")

    # Relationship to providers who work at this institution
    providers = relationship("Provider", back_populates="institution")

    # Relationship to Referrals
    referrals = relationship("Referral", back_populates="provider_institution")

    def __repr__(self):
        return f"<ProviderInstitution(id={self.id}, name={self.name})>"
