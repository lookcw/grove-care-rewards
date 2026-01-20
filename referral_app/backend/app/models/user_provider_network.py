from sqlalchemy import Column, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, validates
from .base import BaseModel


class UserProviderNetwork(BaseModel):
    """
    User's personal network of providers and institutions.
    Each entry represents one provider OR one institution (mutually exclusive).
    """

    __tablename__ = "user_provider_networks"

    # Foreign keys
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    provider_id = Column(UUID(as_uuid=True), ForeignKey("providers.id", ondelete="CASCADE"), nullable=True, index=True)
    provider_institution_id = Column(
        UUID(as_uuid=True), ForeignKey("provider_institutions.id", ondelete="CASCADE"), nullable=True, index=True
    )

    # Relationships
    user = relationship("User", back_populates="provider_networks")
    provider = relationship("Provider")
    provider_institution = relationship("ProviderInstitution")

    # Constraints
    __table_args__ = (
        CheckConstraint(
            "(provider_id IS NOT NULL)::int + (provider_institution_id IS NOT NULL)::int = 1",
            name="check_exactly_one_network_target",
        ),
        UniqueConstraint("user_id", "provider_id", name="unique_user_provider"),
        UniqueConstraint("user_id", "provider_institution_id", name="unique_user_institution"),
    )

    @validates("provider_id", "provider_institution_id")
    def validate_network_target(self, key, value):
        """Application-level validation for mutually exclusive foreign keys."""
        if key == "provider_id" and value is not None:
            if self.provider_institution_id is not None:
                raise ValueError("Cannot set provider_id when provider_institution_id is already set.")
        elif key == "provider_institution_id" and value is not None:
            if self.provider_id is not None:
                raise ValueError("Cannot set provider_institution_id when provider_id is already set.")
        return value

    @property
    def network_target_type(self):
        """Returns 'provider' or 'provider_institution'."""
        if self.provider_id:
            return "provider"
        elif self.provider_institution_id:
            return "provider_institution"
        return None

    @property
    def network_target(self):
        """Returns the actual provider or institution object."""
        return self.provider if self.provider_id else self.provider_institution

    def __repr__(self):
        target = (
            f"provider_id={self.provider_id}"
            if self.provider_id
            else f"provider_institution_id={self.provider_institution_id}"
        )
        return f"<UserProviderNetwork(id={self.id}, user_id={self.user_id}, {target})>"
