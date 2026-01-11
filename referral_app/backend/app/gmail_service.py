"""
Email utilities using Gmail API with OAuth2 service account authentication.
"""
import os
import json
import logging
import base64
from typing import Optional
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

logger = logging.getLogger(__name__)

# Gmail API scopes
SCOPES = ['https://www.googleapis.com/auth/gmail.send']


def get_service_account_info():
    """
    Load service account credentials based on environment.

    Returns:
        dict: Service account JSON credentials
    """
    env = os.getenv("ENVIRONMENT", "local")

    if env in ["staging", "production"]:
        try:
            from google.cloud import secretmanager
            client = secretmanager.SecretManagerServiceClient()
            project_id = os.getenv("GOOGLE_CLOUD_PROJECT")

            secret_name = f"projects/{project_id}/secrets/gmail-service-account-key/versions/latest"
            response = client.access_secret_version(request={"name": secret_name})
            return json.loads(response.payload.data.decode("UTF-8"))
        except Exception as e:
            logger.error(f"Failed to get service account from Secret Manager: {e}")
            return None
    else:
        # Load from local file
        key_file = os.getenv("GMAIL_SERVICE_ACCOUNT_FILE")
        if not key_file:
            logger.error("GMAIL_SERVICE_ACCOUNT_FILE not set in environment")
            return None

        try:
            with open(key_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load service account file: {e}")
            return None


def get_frontend_url():
    """Get frontend URL based on environment."""
    env = os.getenv("ENVIRONMENT", "local")
    if env == "production":
        return os.getenv("FRONTEND_URL", "https://your-app.com")
    elif env == "staging":
        return os.getenv("FRONTEND_URL", "https://staging-your-app.com")
    else:
        return os.getenv("FRONTEND_URL", "http://localhost:5173")


def get_gmail_service():
    """
    Get Gmail API service using service account with domain-wide delegation.

    Returns:
        Resource: Gmail API service object
    """
    service_account_info = get_service_account_info()
    if not service_account_info:
        logger.error("Service account credentials not available")
        return None

    sender_email = os.getenv("GMAIL_SENDER_EMAIL", "chris@grovehealth.us")

    try:
        # Create credentials with domain-wide delegation
        credentials = service_account.Credentials.from_service_account_info(
            service_account_info,
            scopes=SCOPES,
            subject=sender_email  # Impersonate this REAL user (not alias)
        )

        # Build Gmail API service
        service = build('gmail', 'v1', credentials=credentials)
        return service
    except Exception as e:
        logger.error(f"Failed to create Gmail service: {e}")
        return None


def send_email_via_gmail_api(to_email: str, subject: str, html_content: str) -> bool:
    """
    Send email using Gmail API with service account.

    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML content of the email

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    service = get_gmail_service()
    if not service:
        logger.error("Gmail service not available. Email not sent.")
        logger.info(f"Would have sent email to {to_email} with subject: {subject}")
        return False

    # Use GMAIL_FROM_EMAIL if set, otherwise fall back to GMAIL_SENDER_EMAIL
    from_email = os.getenv("GMAIL_FROM_EMAIL") or os.getenv("GMAIL_SENDER_EMAIL", "chris@grovehealth.us")

    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = from_email  # This will be help@grovehealth.us
        message["To"] = to_email

        # Attach HTML content
        html_part = MIMEText(html_content, "html")
        message.attach(html_part)

        # Encode message in base64
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')

        # Send email via Gmail API
        # Use sendAs parameter to specify which identity to send from
        send_message = {'raw': raw_message}
        result = service.users().messages().send(
            userId='me',
            body=send_message
        ).execute()

        logger.info(f"Email sent to {to_email}. Message ID: {result['id']}")
        return True

    except HttpError as e:
        logger.error(f"Gmail API HTTP error sending to {to_email}: {e}")
        return False
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False


async def send_password_reset_email(email: str, token: str):
    """
    Send password reset email with reset link.

    Args:
        email: User's email address
        token: Password reset token
    """
    try:
        frontend_url = get_frontend_url()
        reset_link = f"{frontend_url}/reset-password?token={token}"

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .button {{
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    margin: 20px 0;
                }}
                .footer {{ margin-top: 30px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Reset Your Password</h2>
                <p>You requested to reset your password for your Grove Health account.</p>
                <p>Click the button below to reset your password:</p>
                <a href="{reset_link}" class="button">Reset Password</a>
                <p>Or copy and paste this link into your browser:</p>
                <p><a href="{reset_link}">{reset_link}</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
                <div class="footer">
                    <p>Grove Health<br>
                    This is an automated email, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        """

        send_email_via_gmail_api(email, "Reset Your Password - Grove Care Rewards", html_content)

    except Exception as e:
        logger.error(f"Failed to send password reset email to {email}: {e}")


async def send_verification_email(email: str, token: str):
    """
    Send email verification email.

    Args:
        email: User's email address
        token: Email verification token
    """
    try:
        frontend_url = get_frontend_url()
        verify_link = f"{frontend_url}/verify-email?token={token}"

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .button {{
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    margin: 20px 0;
                }}
                .footer {{ margin-top: 30px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Welcome to Grove Care Rewards!</h2>
                <p>Thank you for registering. Please verify your email address to get started.</p>
                <a href="{verify_link}" class="button">Verify Email</a>
                <p>Or copy and paste this link into your browser:</p>
                <p><a href="{verify_link}">{verify_link}</a></p>
                <div class="footer">
                    <p>Grove Care Rewards<br>
                    This is an automated email, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        """

        send_email_via_gmail_api(email, "Verify Your Email - Grove Care Rewards", html_content)

    except Exception as e:
        logger.error(f"Failed to send verification email to {email}: {e}")


async def send_referral_notification_email(
    referral_id: str,
    user_email: str,
    patient_name: str,
    referral_target_name: str,
    referral_target_type: str,
    notes: Optional[str] = None
):
    """
    Send email notification about new referral to help@grovehealth.us.

    Args:
        referral_id: ID of the referral
        user_email: Email of the user who created the referral
        patient_name: Name of the patient
        referral_target_name: Name of provider or institution
        referral_target_type: Type of referral target ("provider" or "provider_institution")
        notes: Optional notes from the referral (can be None)
    """
    try:
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .info-section {{
                    background-color: #f5f5f5;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 15px 0;
                }}
                .info-row {{
                    margin: 8px 0;
                }}
                .label {{
                    font-weight: bold;
                    display: inline-block;
                    width: 150px;
                }}
                .footer {{ margin-top: 30px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>New Referral Created</h2>
                <p>A new referral has been submitted through the Grove Care Rewards platform.</p>

                <div class="info-section">
                    <div class="info-row">
                        <span class="label">Referral ID:</span>
                        <span>{referral_id}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Created By:</span>
                        <span>{user_email}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Patient Name:</span>
                        <span>{patient_name}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Referral Target:</span>
                        <span>{referral_target_name} ({referral_target_type.replace('_', ' ').title()})</span>
                    </div>
                    {f'''<div class="info-row">
                        <span class="label">Notes:</span>
                        <span>{notes}</span>
                    </div>''' if notes else ''}
                </div>

                <div class="footer">
                    <p>Grove Care Rewards<br>
                    This is an automated notification email.</p>
                </div>
            </div>
        </body>
        </html>
        """

        send_email_via_gmail_api(
            "help@grovehealth.us",
            f"New Referral Created - {referral_id}",
            html_content
        )
        logger.info(f"Referral notification email sent for referral {referral_id}")

    except Exception as e:
        logger.error(f"Failed to send referral notification email for {referral_id}: {e}")
