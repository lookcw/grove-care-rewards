"""
Quick script to check configured Send As addresses.
"""
import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

from dotenv import load_dotenv
load_dotenv()

SCOPES = ['https://www.googleapis.com/auth/gmail.settings.basic']

# Load service account
key_file = os.getenv("GMAIL_SERVICE_ACCOUNT_FILE", "/app/service-account-key.json")
with open(key_file, 'r') as f:
    service_account_info = json.load(f)

# Impersonate the main email account
sender_email = os.getenv("GMAIL_SENDER_EMAIL", "chris@grovehealth.us")

# Create credentials
credentials = service_account.Credentials.from_service_account_info(
    service_account_info,
    scopes=SCOPES,
    subject=sender_email
)

# Build Gmail API service
service = build('gmail', 'v1', credentials=credentials)

# List Send As addresses
print(f"\nChecking Send As addresses for: {sender_email}\n")
print("=" * 60)

try:
    send_as_list = service.users().settings().sendAs().list(userId='me').execute()

    if 'sendAs' in send_as_list:
        for alias in send_as_list['sendAs']:
            print(f"\n✓ {alias['sendAsEmail']}")
            print(f"  Display Name: {alias.get('displayName', 'N/A')}")
            print(f"  Is Default: {alias.get('isDefault', False)}")
            print(f"  Treat as Alias: {alias.get('treatAsAlias', False)}")
            print(f"  Verification Status: {alias.get('verificationStatus', 'N/A')}")
    else:
        print("No Send As addresses found")

except Exception as e:
    print(f"Error: {e}")
    print("\nMake sure you've added the scope:")
    print("https://www.googleapis.com/auth/gmail.settings.basic")
    print("to your domain-wide delegation configuration")

print("=" * 60)
