"""
Google Cloud Storage service for uploading and downloading blobs.
"""

import logging
from typing import Optional
from google.cloud import storage
from google.cloud.exceptions import NotFound, GoogleCloudError

logger = logging.getLogger(__name__)


def get_storage_client() -> storage.Client:
    """
    Get Google Cloud Storage client.

    Returns:
        storage.Client: Authenticated GCS client
    """
    return storage.Client()


def upload_blob(
    bucket_name: str,
    source_data: bytes,
    destination_blob_name: str,
    content_type: Optional[str] = None,
    metadata: Optional[dict[str, str]] = None,
) -> str:
    """
    Upload data to Google Cloud Storage bucket.

    Args:
        bucket_name: Name of the GCS bucket
        source_data: Bytes data to upload
        destination_blob_name: Path/name for the blob in the bucket (e.g., "faxes/file.pdf")
        content_type: Optional MIME type (e.g., "application/pdf", "image/jpeg")
        metadata: Optional custom metadata dict to attach to the blob

    Returns:
        Public URL of the uploaded blob

    Raises:
        GoogleCloudError: If upload fails

    Example:
        >>> pdf_data = Path("file.pdf").read_bytes()
        >>> url = upload_blob("my-bucket", pdf_data, "documents/file.pdf", "application/pdf")
    """
    try:
        client = get_storage_client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(destination_blob_name)

        # Set custom metadata if provided
        if metadata:
            blob.metadata = metadata

        # Upload the data
        blob.upload_from_string(source_data, content_type=content_type)

        logger.info(f"Uploaded blob to gs://{bucket_name}/{destination_blob_name}")

        # Return the public URL
        return f"gs://{bucket_name}/{destination_blob_name}"
    except GoogleCloudError as e:
        logger.error(f"Failed to upload blob to GCS: {e}")
        raise


def download_blob(bucket_name: str, source_blob_name: str) -> bytes:
    """
    Download blob from Google Cloud Storage bucket.

    Args:
        bucket_name: Name of the GCS bucket
        source_blob_name: Path/name of the blob in the bucket

    Returns:
        Blob content as bytes

    Raises:
        NotFound: If blob doesn't exist
        GoogleCloudError: If download fails

    Example:
        >>> pdf_data = download_blob("my-bucket", "documents/file.pdf")
        >>> Path("downloaded.pdf").write_bytes(pdf_data)
    """
    try:
        client = get_storage_client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(source_blob_name)

        # Download the blob
        data = blob.download_as_bytes()

        logger.info(f"Downloaded blob from gs://{bucket_name}/{source_blob_name}")
        return data
    except NotFound:
        logger.error(f"Blob not found: gs://{bucket_name}/{source_blob_name}")
        raise
    except GoogleCloudError as e:
        logger.error(f"Failed to download blob from GCS: {e}")
        raise


def delete_blob(bucket_name: str, blob_name: str) -> None:
    """
    Delete blob from Google Cloud Storage bucket.

    Args:
        bucket_name: Name of the GCS bucket
        blob_name: Path/name of the blob to delete

    Raises:
        NotFound: If blob doesn't exist
        GoogleCloudError: If deletion fails

    Example:
        >>> delete_blob("my-bucket", "documents/old-file.pdf")
    """
    try:
        client = get_storage_client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_name)

        blob.delete()

        logger.info(f"Deleted blob gs://{bucket_name}/{blob_name}")
    except NotFound:
        logger.error(f"Blob not found: gs://{bucket_name}/{blob_name}")
        raise
    except GoogleCloudError as e:
        logger.error(f"Failed to delete blob from GCS: {e}")
        raise


def list_blobs(bucket_name: str, prefix: Optional[str] = None) -> list[str]:
    """
    List blobs in a Google Cloud Storage bucket.

    Args:
        bucket_name: Name of the GCS bucket
        prefix: Optional prefix to filter blobs (e.g., "faxes/" to list only faxes)

    Returns:
        List of blob names (paths)

    Raises:
        GoogleCloudError: If listing fails

    Example:
        >>> blobs = list_blobs("my-bucket", prefix="faxes/")
        >>> print(blobs)  # ['faxes/file1.pdf', 'faxes/file2.pdf']
    """
    try:
        client = get_storage_client()
        bucket = client.bucket(bucket_name)

        # List blobs with optional prefix
        blobs = bucket.list_blobs(prefix=prefix)
        blob_names = [blob.name for blob in blobs]

        logger.info(f"Listed {len(blob_names)} blobs from gs://{bucket_name}/{prefix or ''}")
        return blob_names
    except GoogleCloudError as e:
        logger.error(f"Failed to list blobs from GCS: {e}")
        raise


def blob_exists(bucket_name: str, blob_name: str) -> bool:
    """
    Check if a blob exists in Google Cloud Storage bucket.

    Args:
        bucket_name: Name of the GCS bucket
        blob_name: Path/name of the blob to check

    Returns:
        True if blob exists, False otherwise

    Example:
        >>> if blob_exists("my-bucket", "documents/file.pdf"):
        >>>     print("File exists!")
    """
    try:
        client = get_storage_client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_name)

        return blob.exists()
    except GoogleCloudError as e:
        logger.error(f"Failed to check blob existence: {e}")
        return False
