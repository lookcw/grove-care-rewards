"""Google Cloud Document AI service for extracting data from referral orders."""

import asyncio
import json
import logging
import os
import re
from datetime import date, datetime

from google.api_core.client_options import ClientOptions
from google.cloud import documentai
from google.oauth2 import service_account

from .document_ai_schemas import DocAIReferralDocument, ExtractedReferralData

logger = logging.getLogger(__name__)


def get_document_ai_credentials() -> service_account.Credentials | None:
    """Load credentials from service account file for Document AI API.

    Returns:
        Credentials object if service account file is provided,
        None to use Application Default Credentials (ADC).
    """
    env = os.getenv("ENVIRONMENT", "local")

    if env in ["staging", "production"]:
        # Use Application Default Credentials in cloud environments
        return None

    # Local development: try to load from service account file
    key_file = os.getenv("DOCUMENT_AI_SERVICE_ACCOUNT_FILE")

    if not key_file:
        # If no service account file is specified, use ADC as fallback
        logger.info("No service account file specified, using Application Default Credentials")
        return None

    if not os.path.exists(key_file):
        raise FileNotFoundError(f"Service account file not found: {key_file}")

    with open(key_file, encoding="utf-8") as f:
        service_account_info = json.load(f)

    credentials = service_account.Credentials.from_service_account_info(
        service_account_info,
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )

    logger.info(f"Using service account credentials from: {key_file}")
    return credentials


def get_document_ai_client() -> documentai.DocumentProcessorServiceClient:
    """Get configured Document AI client.

    Returns:
        Initialized Document AI client.
    """
    credentials = get_document_ai_credentials()
    location = os.getenv("DOCUMENT_AI_LOCATION", "us")

    # Create client options with location endpoint
    opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")

    if credentials:
        return documentai.DocumentProcessorServiceClient(credentials=credentials, client_options=opts)

    # Use ADC in cloud environments
    return documentai.DocumentProcessorServiceClient(client_options=opts)


def validate_pdf(file_content: bytes) -> tuple[bool, str]:
    """Validate PDF or image file format and size.

    Args:
        file_content: Raw file bytes

    Returns:
        Tuple of (is_valid, error_message)
    """
    # Check file size (Document AI limit: 20MB)
    max_size = 20 * 1024 * 1024  # 20MB in bytes
    if len(file_content) > max_size:
        return False, f"File size exceeds 20MB limit (got {len(file_content)} bytes)"

    # Check minimum size
    if len(file_content) < 100:
        return False, "File is too small to be a valid document"

    # Check for PDF magic bytes
    if file_content.startswith(b"%PDF"):
        return True, ""

    # Check for common image formats (JPEG, PNG)
    if file_content.startswith(b"\xff\xd8\xff"):  # JPEG
        return True, ""

    if file_content.startswith(b"\x89PNG\r\n\x1a\n"):  # PNG
        return True, ""

    return False, "File format not supported. Use PDF, JPEG, or PNG."


def parse_date(date_str: str | None) -> date | None:
    """Parse date string in various formats.

    Args:
        date_str: Date string to parse

    Returns:
        Parsed date object or None if parsing fails
    """
    if not date_str:
        return None

    # Try common date formats
    date_formats = [
        "%m/%d/%Y",
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%m-%d-%Y",
        "%Y/%m/%d",
    ]

    for fmt in date_formats:
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue

    return None


def extract_entities_as_json(document: documentai.Document) -> dict:
    """Convert Document AI entities to nested JSON structure.

    Handles both flat entities and nested entities with properties.

    Args:
        document: Document AI document

    Returns:
        Dictionary with entity structure
    """

    def process_entity(entity: documentai.Document.Entity) -> dict | str:
        """Process an entity and its properties recursively."""
        # If entity has properties, create nested structure
        if entity.properties:
            result = {}
            for prop in entity.properties:
                key = prop.type_
                value = (
                    prop.normalized_value.text
                    if prop.normalized_value and prop.normalized_value.text
                    else prop.mention_text
                )

                # Handle repeated fields
                if key in result:
                    if not isinstance(result[key], list):
                        result[key] = [result[key]]
                    result[key].append(value)
                else:
                    result[key] = value
            return result

        # Otherwise, just return the text value
        return (
            entity.normalized_value.text
            if entity.normalized_value and entity.normalized_value.text
            else entity.mention_text
        )

    result = {}

    for entity in document.entities:
        key = entity.type_
        value = process_entity(entity)

        # Handle repeated fields
        if key in result:
            if not isinstance(result[key], list):
                result[key] = [result[key]]
            result[key].append(value)
        else:
            result[key] = value

    return result


def parse_name(full_name: str | None) -> tuple[str | None, str | None]:
    """Parse full name into first and last name.

    Args:
        full_name: Full name string (e.g., "OLAGBEGI, ADEDOYIN" or "John Doe")

    Returns:
        Tuple of (first_name, last_name)
    """
    if not full_name:
        return None, None

    # Handle "LAST, FIRST" format
    if "," in full_name:
        parts = full_name.split(",", 1)
        last_name = parts[0].strip()
        first_name = parts[1].strip() if len(parts) > 1 else None
        return first_name, last_name

    # Handle "FIRST LAST" format
    parts = full_name.strip().split()
    if len(parts) >= 2:
        first_name = parts[0]
        last_name = " ".join(parts[1:])
        return first_name, last_name

    # Single name
    return None, full_name


def extract_icd10_codes(text: str) -> list[str]:
    """Extract ICD-10 codes from text using regex.

    Args:
        text: Text to search for ICD-10 codes

    Returns:
        List of unique ICD-10 codes found
    """
    # ICD-10 pattern: Letter followed by 2-5 digits with optional decimal
    pattern = r"\b[A-Z]\d{2}(?:\.\d{1,2})?\b"
    matches = re.findall(pattern, text)
    return list(set(matches))  # Return unique codes


def parse_document_ai_response(
    document: documentai.Document,
) -> ExtractedReferralData:
    """Parse Document AI response into structured Pydantic model.

    Uses automatic Pydantic validation to convert the nested entity
    structure from Document AI into our clean data model.

    Args:
        document: Document AI processed document

    Returns:
        Extracted referral data as Pydantic model
    """
    # Convert entities to JSON structure
    entities_json = extract_entities_as_json(document)

    # Add raw text and confidence score
    entities_json["raw_text"] = document.text
    if document.entities:
        confidences = [e.confidence for e in document.entities if e.confidence > 0]
        if confidences:
            entities_json["confidence_score"] = sum(confidences) / len(confidences)

    # Use Pydantic to validate and parse the JSON structure
    doc_ai_model = DocAIReferralDocument.model_validate(entities_json)

    # Convert to clean output format
    return ExtractedReferralData.from_docai_document(doc_ai_model)


async def process_referral_document(file_content: bytes, mime_type: str = "application/pdf") -> ExtractedReferralData:
    """Process a referral order PDF/image and extract structured data.

    Args:
        file_content: Raw file bytes
        mime_type: MIME type of the document (default: application/pdf)

    Returns:
        Extracted referral data as Pydantic model

    Raises:
        ValueError: If file validation fails
        Exception: If Document AI processing fails
    """
    # Validate file
    is_valid, error_message = validate_pdf(file_content)
    if not is_valid:
        raise ValueError(f"File validation failed: {error_message}")

    # Get required configuration
    project_id = os.getenv("DOCUMENT_AI_PROJECT_ID")
    location = os.getenv("DOCUMENT_AI_LOCATION", "us")
    processor_id = os.getenv("DOCUMENT_AI_PROCESSOR_ID")

    if not project_id or not processor_id:
        raise ValueError("DOCUMENT_AI_PROJECT_ID and DOCUMENT_AI_PROCESSOR_ID must be set")

    # Build processor name
    processor_name = f"projects/{project_id}/locations/{location}/processors/{processor_id}"

    # Get Document AI client
    client = get_document_ai_client()

    # Create process request
    raw_document = documentai.RawDocument(content=file_content, mime_type=mime_type)

    request = documentai.ProcessRequest(name=processor_name, raw_document=raw_document)

    # Process document (run synchronous call in executor)
    logger.info(f"Processing document with processor: {processor_name}")
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, client.process_document, request)

    # Parse response
    extracted_data = parse_document_ai_response(result.document)

    logger.info("Document processed successfully")
    return extracted_data
