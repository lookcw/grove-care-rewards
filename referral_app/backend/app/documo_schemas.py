"""
Pydantic schemas for Documo webhook payloads.
"""

from pydantic import BaseModel, Field
from typing import Any, Optional


class DocumoFaxWebhookPayload(BaseModel):
    """Schema for Documo fax webhook payload (inbound fax)."""

    # Required fields
    messageId: str
    direction: str  # "inbound" or "outbound"

    # Optional fields - Documo may not send all of these or may send null
    deliveryId: Optional[str] = None
    watermark: Optional[str] = None
    messageNumber: Optional[str] = None
    status: Optional[str] = None
    pagesCount: Optional[int] = None
    pagesComplete: Optional[int] = None
    duration: Optional[int] = None
    faxNumber: Optional[str] = None  # The fax number that received the fax
    faxCsid: Optional[str] = None
    faxReceiverCsid: Optional[str] = None
    faxCallerId: Optional[str] = None  # Caller ID of sender
    faxECM: Optional[int] = None
    faxSpeed: Optional[int] = None
    faxDetected: Optional[bool] = None
    faxProtocol: Optional[int] = None
    faxAttempt: Optional[int] = None
    channelType: Optional[str] = None
    recipientName: Optional[str] = None
    subject: Optional[str] = None
    deviceId: Optional[str] = None
    faxBridgeId: Optional[str] = None  # Note: capital B in Bridge
    accountId: Optional[str] = None
    errorCode: Optional[str] = None
    resultCode: Optional[str] = None
    isArchived: Optional[bool] = None
    isFilePurged: Optional[bool] = None
    country: Optional[str] = None
    createdAt: Optional[str] = None  # ISO 8601 datetime
    readyAt: Optional[str] = None
    resolvedDate: Optional[str] = None
    deletedAt: Optional[str] = None

    # Nested objects that might be included
    account: Optional[dict[str, Any]] = None
    customFields: Optional[dict[str, Any]] = None

    # Allow extra fields that Documo might send
    class Config:
        extra = "allow"
