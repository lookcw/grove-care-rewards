"""
Documo fax API service for webhook authentication and PDF downloads.
"""

import base64
import logging
from pathlib import Path
from typing import Optional
import httpx

logger = logging.getLogger(__name__)


def verify_webhook_auth(authorization: Optional[str], expected_username: str, expected_password: str) -> bool:
    """
    Verify Basic Auth credentials from webhook request.

    Args:
        authorization: The Authorization header value (e.g., "Basic base64string")
        expected_username: Expected username from environment
        expected_password: Expected password from environment

    Returns:
        True if credentials match, False otherwise
    """
    if not authorization:
        return False

    # Check if it's Basic auth
    if not authorization.startswith("Basic "):
        return False

    try:
        # Decode the base64 credentials
        encoded_credentials = authorization.replace("Basic ", "")
        decoded_credentials = base64.b64decode(encoded_credentials).decode("utf-8")
        username, password = decoded_credentials.split(":", 1)

        # Compare with expected credentials
        return username == expected_username and password == expected_password
    except Exception as e:
        logger.warning(f"Failed to parse Basic Auth credentials: {e}")
        return False


async def download_fax_pdf(message_id: str, api_key: str, base_url: str) -> bytes:
    """
    Download fax PDF from Documo API.

    Args:
        message_id: Documo fax message ID
        api_key: Documo API key for authentication
        base_url: Documo API base URL (e.g., https://api.documo.com/v1)

    Returns:
        PDF file content as bytes

    Raises:
        httpx.HTTPError: If download fails
    """
    url = f"{base_url}/fax/{message_id}/download?format=pdf"
    headers = {"Authorization": f"Bearer {api_key}"}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, timeout=30.0)
        response.raise_for_status()
        return response.content


async def store_fax_pdf(message_id: str, pdf_data: bytes, storage_dir: str = "faxes") -> str:
    """
    Store PDF file locally.

    Args:
        message_id: Documo fax message ID (used as filename)
        pdf_data: PDF file content as bytes
        storage_dir: Directory to store faxes (relative to backend root)

    Returns:
        Path to stored PDF file
    """
    # Create storage directory if it doesn't exist
    storage_path = Path(storage_dir)
    storage_path.mkdir(exist_ok=True, parents=True)

    # Create filename from message_id
    filename = f"{message_id}.pdf"
    file_path = storage_path / filename

    # Write PDF to file
    file_path.write_bytes(pdf_data)

    logger.info(f"Stored fax PDF at: {file_path}")
    return str(file_path)
