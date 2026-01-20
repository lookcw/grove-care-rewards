"""Pydantic schemas for Document AI extracted data."""

from datetime import date

from pydantic import BaseModel, ConfigDict, Field

# ============================================================================
# Document AI Raw Structure Models (match the API response exactly)
# ============================================================================


class DocAIPatient(BaseModel):
    """Patient entity from Document AI (nested structure)."""

    model_config = ConfigDict(extra="ignore")

    name: str | None = None
    id: str | None = None
    date_of_birth: str | None = None
    age: str | None = None
    sex: str | None = None
    address: str | None = None
    phone: str | None = None


class DocAIProvider(BaseModel):
    """Provider entity from Document AI (nested structure)."""

    model_config = ConfigDict(extra="ignore")

    name: str | None = None
    facility_name: str | None = None
    address: str | None = None
    phone: str | None = None
    fax: str | None = None
    electronically_signed_by: str | None = None


class DocAIInsurance(BaseModel):
    """Insurance entity from Document AI (nested structure)."""

    model_config = ConfigDict(extra="ignore")

    plan_name: str | None = None
    id: str | None = None  # Policy number
    group_number: str | None = None
    policy_holder: str | None = None


class DocAIReferralDocument(BaseModel):
    """Top-level Document AI response structure."""

    model_config = ConfigDict(extra="ignore")

    # Top-level entities
    patient: DocAIPatient | None = None
    originating_provider: DocAIProvider | None = None
    referred_provider: DocAIProvider | None = None
    primary_insurance: DocAIInsurance | None = None
    secondary_insurance: DocAIInsurance | None = None

    # Clinical fields (flat at top level)
    diagnosis: str | None = None
    order_details: str | None = None
    order_name: str | None = None
    notes: str | None = None
    referral_date: str | None = None
    electronically_signed_by: str | None = None

    # Metadata
    raw_text: str | None = None
    confidence_score: float | None = None


# ============================================================================
# Clean Output Models (our API response format)
# ============================================================================


class ReferralProviderInfo(BaseModel):
    """Referring provider information extracted from referral order."""

    model_config = ConfigDict(from_attributes=True)

    name: str | None = None
    institution_name: str | None = None
    npi: str | None = None
    phone: str | None = None
    fax: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None


class ReferralPatientInfo(BaseModel):
    """Patient demographic information extracted from referral order."""

    model_config = ConfigDict(from_attributes=True)

    first_name: str | None = None
    last_name: str | None = None
    full_name: str | None = None
    date_of_birth: date | None = None
    age: str | None = None
    sex: str | None = None
    phone_home: str | None = None
    phone_mobile: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    patient_id: str | None = None
    medical_record_number: str | None = None


class ReferralInsuranceInfo(BaseModel):
    """Insurance information extracted from referral order."""

    model_config = ConfigDict(from_attributes=True)

    # Primary Insurance
    primary_insurance_provider: str | None = None
    primary_policy_number: str | None = None
    primary_group_number: str | None = None
    primary_subscriber_name: str | None = None

    # Secondary Insurance
    secondary_insurance_provider: str | None = None
    secondary_policy_number: str | None = None
    secondary_group_number: str | None = None
    secondary_subscriber_name: str | None = None


class ReferralClinicalInfo(BaseModel):
    """Clinical information extracted from referral order."""

    model_config = ConfigDict(from_attributes=True)

    diagnosis_codes: list[str] = Field(default_factory=list)
    diagnosis_descriptions: list[str] = Field(default_factory=list)
    reason_for_referral: str | None = None
    clinical_notes: str | None = None
    specialty_requested: str | None = None
    urgency: str | None = None
    orders_count: str | None = None
    schedule_within: str | None = None


class ReferralTargetInfo(BaseModel):
    """Target provider/institution information from referral order."""

    model_config = ConfigDict(from_attributes=True)

    provider_name: str | None = None
    institution_name: str | None = None
    specialty: str | None = None
    npi: str | None = None
    phone: str | None = None
    fax: str | None = None


class ExtractedReferralData(BaseModel):
    """Complete extracted referral order data from Document AI."""

    model_config = ConfigDict(from_attributes=True)

    referring_provider: ReferralProviderInfo = Field(default_factory=ReferralProviderInfo)
    patient: ReferralPatientInfo = Field(default_factory=ReferralPatientInfo)
    insurance: ReferralInsuranceInfo = Field(default_factory=ReferralInsuranceInfo)
    clinical: ReferralClinicalInfo = Field(default_factory=ReferralClinicalInfo)
    target: ReferralTargetInfo = Field(default_factory=ReferralTargetInfo)

    # Metadata
    referral_date: date | None = None
    document_type: str = "referral_order"
    signed_by: str | None = None
    confidence_score: float | None = Field(None, description="Overall extraction confidence score")
    raw_text: str | None = Field(None, description="Full extracted text")

    @classmethod
    def from_docai_document(cls, doc: DocAIReferralDocument) -> "ExtractedReferralData":
        """Convert Document AI raw structure to clean extracted data.

        Args:
            doc: Document AI document with nested entities

        Returns:
            Clean ExtractedReferralData model
        """
        import re
        from datetime import datetime

        def parse_date(date_str: str | None) -> date | None:
            """Parse date string in various formats."""
            if not date_str:
                return None
            for fmt in ["%m/%d/%Y", "%Y-%m-%d", "%d/%m/%Y", "%m-%d-%Y", "%Y/%m/%d"]:
                try:
                    return datetime.strptime(date_str, fmt).date()
                except ValueError:
                    continue
            return None

        def parse_name(full_name: str | None) -> tuple[str | None, str | None]:
            """Parse full name into first and last name."""
            if not full_name:
                return None, None
            if "," in full_name:
                parts = full_name.split(",", 1)
                last_name = parts[0].strip()
                first_name = parts[1].strip() if len(parts) > 1 else None
                return first_name, last_name
            parts = full_name.strip().split()
            if len(parts) >= 2:
                return parts[0], " ".join(parts[1:])
            return None, full_name

        def extract_icd10_codes(text: str | None) -> list[str]:
            """Extract ICD-10 codes from text."""
            if not text:
                return []
            pattern = r"\b[A-Z]\d{2}(?:\.\d{1,2})?\b"
            return list(set(re.findall(pattern, text)))

        # Parse patient
        first_name, last_name = parse_name(doc.patient.name if doc.patient else None)
        patient_dob = parse_date(doc.patient.date_of_birth if doc.patient else None)

        patient = ReferralPatientInfo(
            full_name=doc.patient.name if doc.patient else None,
            first_name=first_name,
            last_name=last_name,
            date_of_birth=patient_dob,
            age=doc.patient.age if doc.patient else None,
            sex=doc.patient.sex if doc.patient else None,
            phone_home=doc.patient.phone if doc.patient else None,
            phone_mobile=doc.patient.phone if doc.patient else None,
            address=doc.patient.address if doc.patient else None,
            patient_id=doc.patient.id if doc.patient else None,
            medical_record_number=doc.patient.id if doc.patient else None,
        )

        # Parse referring provider
        referring_provider = ReferralProviderInfo(
            name=doc.originating_provider.name if doc.originating_provider else None,
            institution_name=doc.originating_provider.facility_name if doc.originating_provider else None,
            phone=doc.originating_provider.phone if doc.originating_provider else None,
            fax=doc.originating_provider.fax if doc.originating_provider else None,
            address=doc.originating_provider.address if doc.originating_provider else None,
        )

        # Parse insurance
        insurance = ReferralInsuranceInfo(
            primary_insurance_provider=doc.primary_insurance.plan_name if doc.primary_insurance else None,
            primary_policy_number=doc.primary_insurance.id if doc.primary_insurance else None,
            primary_group_number=doc.primary_insurance.group_number if doc.primary_insurance else None,
            primary_subscriber_name=doc.primary_insurance.policy_holder if doc.primary_insurance else None,
            secondary_insurance_provider=doc.secondary_insurance.plan_name if doc.secondary_insurance else None,
            secondary_policy_number=doc.secondary_insurance.id if doc.secondary_insurance else None,
            secondary_group_number=doc.secondary_insurance.group_number if doc.secondary_insurance else None,
            secondary_subscriber_name=doc.secondary_insurance.policy_holder if doc.secondary_insurance else None,
        )

        # Parse clinical info
        diagnosis_codes = extract_icd10_codes(doc.diagnosis)
        diagnosis_descriptions = []
        if doc.diagnosis:
            for sep in ["ICD", "-"]:
                if sep in doc.diagnosis:
                    desc = doc.diagnosis.split(sep)[0].strip()
                    if desc:
                        diagnosis_descriptions.append(desc)
                    break

        # Combine notes
        clinical_notes = None
        if doc.notes and doc.order_details:
            clinical_notes = f"{doc.notes}\n\n{doc.order_details}"
        elif doc.notes:
            clinical_notes = doc.notes
        elif doc.order_details:
            clinical_notes = doc.order_details

        # Parse specialty and schedule_within from order_details
        specialty = None
        schedule_within = None
        if doc.order_details:
            if "PHYSICAL THERAPIST" in doc.order_details:
                specialty = "PHYSICAL THERAPIST REFERRAL"
            if "Schedule Within:" in doc.order_details:
                schedule_within = doc.order_details.split("Schedule Within:")[1].strip()

        clinical = ReferralClinicalInfo(
            diagnosis_codes=diagnosis_codes,
            diagnosis_descriptions=diagnosis_descriptions,
            reason_for_referral=doc.diagnosis,
            clinical_notes=clinical_notes,
            specialty_requested=specialty,
            orders_count=doc.order_name,
            schedule_within=schedule_within,
        )

        # Parse referred provider (target)
        target = ReferralTargetInfo(
            provider_name=doc.referred_provider.name if doc.referred_provider else None,
            institution_name=doc.referred_provider.facility_name if doc.referred_provider else None,
            specialty=doc.referred_provider.name if doc.referred_provider else None,
            phone=doc.referred_provider.phone if doc.referred_provider else None,
            fax=doc.referred_provider.fax if doc.referred_provider else None,
        )

        # Parse metadata
        referral_date = parse_date(doc.referral_date)
        signed_by = (
            doc.originating_provider.electronically_signed_by
            if doc.originating_provider and doc.originating_provider.electronically_signed_by
            else doc.electronically_signed_by
        )

        return cls(
            referring_provider=referring_provider,
            patient=patient,
            insurance=insurance,
            clinical=clinical,
            target=target,
            referral_date=referral_date,
            signed_by=signed_by,
            confidence_score=doc.confidence_score,
            raw_text=doc.raw_text,
        )


class DocumentProcessingRequest(BaseModel):
    """Request schema for document processing API endpoint."""

    model_config = ConfigDict(from_attributes=True)

    file_content_base64: str = Field(..., description="Base64-encoded PDF or image file")
    file_name: str | None = Field(None, description="Original filename")
    mime_type: str = Field(default="application/pdf", description="MIME type of the document")


class DocumentProcessingResponse(BaseModel):
    """Response schema for document processing API endpoint."""

    model_config = ConfigDict(from_attributes=True)

    success: bool
    extracted_data: ExtractedReferralData | None = None
    error_message: str | None = None
    processing_time_ms: int | None = None
