"""Simple test to check Document AI authentication and connectivity."""

import os
from dotenv import load_dotenv
from google.cloud import documentai

# Load environment variables
load_dotenv()


def test_auth():
    """Test Document AI authentication."""
    project_id = os.getenv("DOCUMENT_AI_PROJECT_ID")
    location = os.getenv("DOCUMENT_AI_LOCATION", "us")
    processor_id = os.getenv("DOCUMENT_AI_PROCESSOR_ID")

    print(f"Project ID: {project_id}")
    print(f"Location: {location}")
    print(f"Processor ID: {processor_id}")

    # Create client
    print("\nCreating Document AI client...")
    from google.api_core.client_options import ClientOptions

    opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")
    client = documentai.DocumentProcessorServiceClient(client_options=opts)
    print("✓ Client created successfully")

    # Build processor name
    processor_name = f"projects/{project_id}/locations/{location}/processors/{processor_id}"
    print(f"\nProcessor name: {processor_name}")

    # Try to get processor details
    print("\nTrying to get processor details...")
    try:
        processor = client.get_processor(name=processor_name)
        print(f"✓ Processor found: {processor.display_name}")
        print(f"  Type: {processor.type_}")
        print(f"  State: {processor.state}")
    except Exception as e:
        print(f"✗ Error getting processor: {e}")
        return False

    print("\n✓ Authentication successful!")
    return True


if __name__ == "__main__":
    test_auth()
