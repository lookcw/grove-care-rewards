#!/usr/bin/env python
"""
Atlas loader script for SQLAlchemy models.
This script is called by Atlas to generate the database schema from SQLAlchemy models.
"""

from atlas_provider_sqlalchemy.ddl import print_ddl
from app.database import Base

# Import all models to ensure they're registered with Base
from app.models import Address, Provider, ProviderInstitution, User, Patient, Referral, Insurance, UserProviderNetwork

# Get all model classes from Base
models = [mapper.class_ for mapper in Base.registry.mappers]

# Print the DDL for Atlas
print_ddl("postgresql://postgres:postgres@localhost/dev", models)
