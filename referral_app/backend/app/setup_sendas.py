"""
Setup script to configure Gmail "Send As" alias for service account.
Run this once to allow sending emails from help@grovehealth.us
"""
import os
import sys
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

SCOPES = ['https://www.googleapis.com/auth/gmail.settings.basic']


def setup_send_as_alias():
    """Configure send-as alias for the Gmail account."""

    # Load service account
    key_file = os.getenv("GMAIL_SERVICE_ACCOUNT_FILE")
    if not key_file:
        print("Error: GMAIL_SERVICE_ACCOUNT_FILE not set")
        return False

    with open(key_file, 'r') as f:
        service_account_info = json.load(f)

    # Impersonate the main email account
    sender_email = os.getenv("GMAIL_SENDER_EMAIL", "chris@grovehealth.us")
    from_email = os.getenv("GMAIL_FROM_EMAIL", "help@grovehealth.us")

    print(f"Setting up send-as alias...")
    print(f"Main account: {sender_email}")
    print(f"Send-as alias: {from_email}")

    # Create credentials with domain-wide delegation
    credentials = service_account.Credentials.from_service_account_info(
        service_account_info,
        scopes=SCOPES,
        subject=sender_email
    )

    # Build Gmail API service
    service = build('gmail', 'v1', credentials=credentials)

    try:
        # Check if alias already exists
        send_as_list = service.users().settings().sendAs().list(userId='me').execute()
        existing_aliases = [alias['sendAsEmail'] for alias in send_as_list.get('sendAs', [])]

        if from_email in existing_aliases:
            print(f"✓ Alias {from_email} already configured")
            return True

        # Create the send-as alias
        send_as_config = {
            'sendAsEmail': from_email,
            'displayName': 'Grove Health Support',
            'replyToAddress': sender_email,
            'treatAsAlias': True,
            'isDefault': False
        }

        result = service.users().settings().sendAs().create(
            userId='me',
            body=send_as_config
        ).execute()

        print(f"✓ Successfully configured send-as alias: {from_email}")
        print(f"  Display name: {result.get('displayName')}")
        print(f"  Reply-to: {result.get('replyToAddress')}")
        return True

    except Exception as e:
        print(f"✗ Error setting up send-as alias: {e}")
        print("\nManual setup required:")
        print(f"1. Log into Gmail as {sender_email}")
        print("2. Go to Settings → Accounts and Import")
        print(f"3. Add '{from_email}' as a send-as address")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("Gmail Send-As Alias Setup")
    print("=" * 60)
    print()

    success = setup_send_as_alias()

    print()
    if success:
        print("✓ Setup complete! Emails will now be sent from the configured alias.")
    else:
        print("✗ Setup failed. Please configure manually.")
    print("=" * 60)
