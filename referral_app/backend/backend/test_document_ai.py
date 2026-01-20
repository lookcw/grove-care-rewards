"""Test script for Document AI integration with sample referral order."""

import asyncio
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from google.cloud import documentai

from app.services.document_ai_service import (
    extract_entities_as_json,
    get_document_ai_client,
    process_referral_document,
)

# Load environment variables from .env file
load_dotenv()


async def test_process_referral():
    """Test Document AI with sample referral order image."""
    test_file = Path("test_data/sample_referral.jpeg")

    if not test_file.exists():
        print(f"❌ Test file not found: {test_file}")
        return

    print(f"📄 Reading test file: {test_file}")
    with open(test_file, "rb") as f:
        content = f.read()

    print(f"📊 File size: {len(content)} bytes")

    try:
        print("🔄 Processing document with Document AI...")

        # First, get the raw Document AI response for debugging
        project_id = os.getenv("DOCUMENT_AI_PROJECT_ID")
        location = os.getenv("DOCUMENT_AI_LOCATION", "us")
        processor_id = os.getenv("DOCUMENT_AI_PROCESSOR_ID")
        processor_name = f"projects/{project_id}/locations/{location}/processors/{processor_id}"

        client = get_document_ai_client()
        raw_document = documentai.RawDocument(content=content, mime_type="image/jpeg")
        request = documentai.ProcessRequest(name=processor_name, raw_document=raw_document)

        print("📡 Calling Document AI API...")
        doc_response = client.process_document(request=request)

        # Show raw JSON structure
        print("\n" + "=" * 80)
        print("RAW DOCUMENT AI JSON STRUCTURE")
        print("=" * 80)
        entities_json = extract_entities_as_json(doc_response.document)
        print(json.dumps(entities_json, indent=2))
        print("=" * 80)

        # Now process with the full pipeline
        print("\n🔄 Processing with extraction pipeline...")
        result = await process_referral_document(content, mime_type="image/jpeg")

        print("\n✅ Document processed successfully!\n")

        # Display extracted data
        print("=" * 80)
        print("EXTRACTED REFERRAL DATA")
        print("=" * 80)

        # Provider Information
        print("\n📋 REFERRING PROVIDER:")
        print(f"  Name: {result.referring_provider.name}")
        print(f"  Institution: {result.referring_provider.institution_name}")
        print(f"  Phone: {result.referring_provider.phone}")
        print(f"  Fax: {result.referring_provider.fax}")
        print(f"  Address: {result.referring_provider.address}")

        # Patient Information
        print("\n👤 PATIENT:")
        print(f"  Name: {result.patient.full_name}")
        print(f"  First Name: {result.patient.first_name}")
        print(f"  Last Name: {result.patient.last_name}")
        print(f"  DOB: {result.patient.date_of_birth}")
        print(f"  Age: {result.patient.age}")
        print(f"  Sex: {result.patient.sex}")
        print(f"  Address: {result.patient.address}")
        print(f"  Phone (Home): {result.patient.phone_home}")
        print(f"  Phone (Mobile): {result.patient.phone_mobile}")
        print(f"  Patient ID: {result.patient.patient_id}")

        # Clinical Information
        print("\n🏥 CLINICAL:")
        print(
            f"  Diagnosis Codes: {', '.join(result.clinical.diagnosis_codes) if result.clinical.diagnosis_codes else 'None'}"
        )
        print(
            f"  Diagnosis Descriptions: {', '.join(result.clinical.diagnosis_descriptions) if result.clinical.diagnosis_descriptions else 'None'}"
        )
        print(f"  Specialty: {result.clinical.specialty_requested}")
        print(f"  Notes: {result.clinical.clinical_notes}")
        print(f"  Schedule Within: {result.clinical.schedule_within}")

        # Insurance Information
        print("\n💳 INSURANCE:")
        print(f"  Primary Provider: {result.insurance.primary_insurance_provider}")
        print(f"  Primary Policy #: {result.insurance.primary_policy_number}")
        print(f"  Primary Group #: {result.insurance.primary_group_number}")
        print(f"  Primary Subscriber: {result.insurance.primary_subscriber_name}")
        print(f"  Secondary Provider: {result.insurance.secondary_insurance_provider or 'None'}")

        # Metadata
        print("\n📅 METADATA:")
        print(f"  Referral Date: {result.referral_date}")
        print(f"  Signed By: {result.signed_by}")
        print(
            f"  Confidence Score: {result.confidence_score:.2%}"
            if result.confidence_score
            else "  Confidence Score: N/A"
        )

        print("\n" + "=" * 80)
        print("\n📝 Full JSON Output:")
        print("=" * 80)
        print(result.model_dump_json(indent=2))

        # Basic validation
        print("\n" + "=" * 80)
        print("VALIDATION CHECKS")
        print("=" * 80)

        checks = [
            ("Patient last name extracted", result.patient.last_name == "OLAGBEGI"),
            (
                "Provider name extracted",
                result.referring_provider.name and "MANCUSO" in result.referring_provider.name.upper(),
            ),
            ("Diagnosis codes found", len(result.clinical.diagnosis_codes) > 0),
            ("Insurance provider extracted", result.insurance.primary_insurance_provider is not None),
        ]

        all_passed = True
        for check_name, passed in checks:
            status = "✅" if passed else "❌"
            print(f"{status} {check_name}")
            if not passed:
                all_passed = False

        if all_passed:
            print("\n🎉 All validation checks passed!")
        else:
            print("\n⚠️  Some validation checks failed")

    except Exception as e:
        print(f"\n❌ Error processing document: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_process_referral())
