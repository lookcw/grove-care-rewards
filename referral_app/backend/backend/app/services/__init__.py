"""Services module for external integrations."""

from .document_ai_schemas import (
    DocumentProcessingRequest,
    DocumentProcessingResponse,
    ExtractedReferralData,
    ReferralClinicalInfo,
    ReferralInsuranceInfo,
    ReferralPatientInfo,
    ReferralProviderInfo,
    ReferralTargetInfo,
)
from .document_ai_service import (
    get_document_ai_client,
    process_referral_document,
    validate_pdf,
)

__all__ = [
    "get_document_ai_client",
    "process_referral_document",
    "validate_pdf",
    "DocumentProcessingRequest",
    "DocumentProcessingResponse",
    "ExtractedReferralData",
    "ReferralClinicalInfo",
    "ReferralInsuranceInfo",
    "ReferralPatientInfo",
    "ReferralProviderInfo",
    "ReferralTargetInfo",
]
