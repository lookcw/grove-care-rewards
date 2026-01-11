"""
Email utilities for sending transactional emails via Gmail SMTP.
"""
import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)


def get_gmail_credentials():
    """Get Gmail credentials from environment or Secret Manager."""
    env = os.getenv("ENVIRONMENT", "local")

    if env in ["staging", "production"]:
        try:
            from google.cloud import secretmanager
            client = secretmanager.SecretManagerServiceClient()
            project_id = os.getenv("GOOGLE_CLOUD_PROJECT")

            # Get email
            email_secret = f"projects/{project_id}/secrets/gmail-email/versions/latest"
            email_response = client.access_secret_version(request={"name": email_secret})
            email = email_response.payload.data.decode("UTF-8")

            # Get app password
            password_secret = f"projects/{project_id}/secrets/gmail-app-password/versions/latest"
            password_response = client.access_secret_version(request={"name": password_secret})
            password = password_response.payload.data.decode("UTF-8")

            return email, password
        except Exception as e:
            logger.error(f"Failed to get Gmail credentials from Secret Manager: {e}")
            return None, None
    else:
        return os.getenv("GMAIL_EMAIL"), os.getenv("GMAIL_APP_PASSWORD")


def get_frontend_url():
    """Get frontend URL based on environment."""
    env = os.getenv("ENVIRONMENT", "local")
    if env == "production":
        return os.getenv("FRONTEND_URL", "https://your-app.com")
    elif env == "staging":
        return os.getenv("FRONTEND_URL", "https://staging-your-app.com")
    else:
        return os.getenv("FRONTEND_URL", "http://localhost:5174")


def send_email_via_gmail(to_email: str, subject: str, html_content: str):
    """
    Send email via Gmail SMTP.

    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML content of the email
    """
    gmail_email, gmail_password = get_gmail_credentials()

    if not gmail_email or not gmail_password:
        logger.error("Gmail credentials not configured. Email not sent.")
        logger.info(f"Would have sent email to {to_email} with subject: {subject}")
        return False

    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = gmail_email
        message["To"] = to_email

        # Attach HTML content
        html_part = MIMEText(html_content, "html")
        message.attach(html_part)

        # Connect to Gmail SMTP server
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(gmail_email, gmail_password)
            server.sendmail(gmail_email, to_email, message.as_string())

        logger.info(f"Email sent to {to_email}")
        return True

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
    gmail_email, gmail_password = get_gmail_credentials()

    if not gmail_email or not gmail_password:
        logger.error("Gmail credentials not configured. Password reset email not sent.")
        logger.info(f"Password reset token for {email}: {token}")
        return

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
                <p>You requested to reset your password for your Grove Care Rewards account.</p>
                <p>Click the button below to reset your password:</p>
                <a href="{reset_link}" class="button">Reset Password</a>
                <p>Or copy and paste this link into your browser:</p>
                <p><a href="{reset_link}">{reset_link}</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
                <div class="footer">
                    <p>Grove Care Rewards<br>
                    This is an automated email, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        """

        send_email_via_gmail(email, "Reset Your Password - Grove Care Rewards", html_content)

    except Exception as e:
        logger.error(f"Failed to send password reset email to {email}: {e}")


async def send_verification_email(email: str, token: str):
    """
    Send email verification email.

    Args:
        email: User's email address
        token: Email verification token
    """
    gmail_email, gmail_password = get_gmail_credentials()

    if not gmail_email or not gmail_password:
        logger.error("Gmail credentials not configured. Verification email not sent.")
        logger.info(f"Verification token for {email}: {token}")
        return

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

        send_email_via_gmail(email, "Verify Your Email - Grove Care Rewards", html_content)

    except Exception as e:
        logger.error(f"Failed to send verification email to {email}: {e}")
