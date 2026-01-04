import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from .database import engine, Base, get_db
from .models.provider import Provider
from .models.provider_institution import ProviderInstitution
from .models.address import Address
from .models.user import User
from .models.patient import Patient
from .models.referral import Referral, ReferralStatus
from .auth import auth_backend, fastapi_users, current_active_user
from .schemas import UserCreate, UserRead, UserUpdate, PatientCreate, ReferralCreate, ReferralRead

# Create FastAPI app
app = FastAPI(title="Referral App API", version="1.0.0")

# Configure CORS
def get_allowed_origins():
    env = os.getenv("ENVIRONMENT", "local")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

    if env == "local":
        return ["http://localhost:5173", "http://localhost:5174"]
    else:
        return [frontend_url]

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication routes
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

# Create database tables on startup
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Health check endpoint
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Hello World from FastAPI!"}

# Database health check endpoint
@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    try:
        # Try to execute a simple query
        await db.execute(select(1))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

# Provider endpoints
@app.get("/providers")
async def get_providers(db: AsyncSession = Depends(get_db)):
    """Get all providers with their addresses and institutions."""
    result = await db.execute(
        select(Provider).options(
            selectinload(Provider.address),
            selectinload(Provider.institution).selectinload(ProviderInstitution.address)
        )
    )
    providers = result.scalars().all()
    return [{
        "id": str(provider.id),
        "first_name": provider.first_name,
        "last_name": provider.last_name,
        "full_name": provider.full_name,
        "email": provider.email,
        "phone": provider.phone,
        "address": {
            "street_address_1": provider.address.street_address_1,
            "street_address_2": provider.address.street_address_2,
            "city": provider.address.city,
            "state": provider.address.state,
            "zip_code": provider.address.zip_code,
            "country": provider.address.country,
        } if provider.address else None,
        "institution": {
            "id": str(provider.institution.id),
            "name": provider.institution.name,
            "website": provider.institution.website,
            "address": {
                "street_address_1": provider.institution.address.street_address_1,
                "street_address_2": provider.institution.address.street_address_2,
                "city": provider.institution.address.city,
                "state": provider.institution.address.state,
                "zip_code": provider.institution.address.zip_code,
                "country": provider.institution.address.country,
            } if provider.institution.address else None,
        } if provider.institution else None,
        "created_at": provider.datetime_created.isoformat() if provider.datetime_created else None,
        "updated_at": provider.datetime_updated.isoformat() if provider.datetime_updated else None,
    } for provider in providers]

@app.get("/providers/{provider_id}")
async def get_provider(provider_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific provider by ID."""
    result = await db.execute(
        select(Provider).options(
            selectinload(Provider.address),
            selectinload(Provider.institution).selectinload(ProviderInstitution.address)
        ).filter(Provider.id == provider_id)
    )
    provider = result.scalar_one_or_none()
    if not provider:
        return {"error": "Provider not found"}

    return {
        "id": str(provider.id),
        "first_name": provider.first_name,
        "last_name": provider.last_name,
        "full_name": provider.full_name,
        "email": provider.email,
        "phone": provider.phone,
        "address": {
            "street_address_1": provider.address.street_address_1,
            "street_address_2": provider.address.street_address_2,
            "city": provider.address.city,
            "state": provider.address.state,
            "zip_code": provider.address.zip_code,
            "country": provider.address.country,
        } if provider.address else None,
        "institution": {
            "id": str(provider.institution.id),
            "name": provider.institution.name,
            "website": provider.institution.website,
            "address": {
                "street_address_1": provider.institution.address.street_address_1,
                "street_address_2": provider.institution.address.street_address_2,
                "city": provider.institution.address.city,
                "state": provider.institution.address.state,
                "zip_code": provider.institution.address.zip_code,
                "country": provider.institution.address.country,
            } if provider.institution.address else None,
        } if provider.institution else None,
        "created_at": provider.datetime_created.isoformat() if provider.datetime_created else None,
        "updated_at": provider.datetime_updated.isoformat() if provider.datetime_updated else None,
    }


# Patient endpoints
@app.get("/patients")
async def get_patients(db: AsyncSession = Depends(get_db)):
    """Get all patients for dropdown."""
    result = await db.execute(select(Patient))
    patients = result.scalars().all()
    return [{
        "id": str(patient.id),
        "first_name": patient.first_name,
        "last_name": patient.last_name,
        "date_of_birth": patient.date_of_birth.isoformat(),
        "phone": patient.phone,
        "email": patient.email
    } for patient in patients]


# Provider institution endpoints
@app.get("/provider-institutions")
async def get_provider_institutions(db: AsyncSession = Depends(get_db)):
    """Get all provider institutions for dropdown."""
    result = await db.execute(select(ProviderInstitution))
    institutions = result.scalars().all()
    return [{
        "id": str(inst.id),
        "name": inst.name
    } for inst in institutions]


# Referral endpoints
@app.post("/referrals", response_model=ReferralRead)
async def create_referral(
    referral_data: ReferralCreate,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new referral (requires authentication)."""
    # Get or create patient
    if referral_data.patient_id:
        result = await db.execute(select(Patient).filter(Patient.id == referral_data.patient_id))
        patient = result.scalar_one_or_none()
        if not patient:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    else:
        patient = Patient(**referral_data.patient_data.dict())
        db.add(patient)
        await db.flush()

    # Create referral
    referral_dict = {
        "user_id": user.id,
        "patient_id": patient.id,
        "status": ReferralStatus.PENDING,
        "notes": referral_data.notes
    }

    if referral_data.referral_target_type == "provider":
        referral_dict["provider_id"] = referral_data.provider_id
    else:
        referral_dict["provider_institution_id"] = referral_data.provider_institution_id

    referral = Referral(**referral_dict)
    db.add(referral)
    await db.commit()
    await db.refresh(referral)

    return referral
