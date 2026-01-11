from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class Address(BaseModel):
    """
    Address model for storing location information.
    Can be associated with providers, patients, or other entities.
    """
    __tablename__ = "addresses"

    street_address_1 = Column(String(255), nullable=False)
    street_address_2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(2), nullable=False)
    zip_code = Column(String(10), nullable=False)
    country = Column(String(100), nullable=False, default="USA")

    # Relationship to providers (back-reference)
    providers = relationship("Provider", back_populates="address")

    # Relationship to provider institutions (back-reference)
    provider_institutions = relationship("ProviderInstitution", back_populates="address")

    # Relationship to patients (back-reference)
    patients = relationship("Patient", back_populates="address")

    def __repr__(self):
        return f"<Address(id={self.id}, city={self.city}, state={self.state})>"
