"""
Seed script to populate the database with sample data.
"""

from database import SessionLocal
from models.provider import Provider
from models.provider_institution import ProviderInstitution
from models.address import Address
from sqlalchemy.exc import SQLAlchemyError


def seed_providers():
    """Seed the database with sample providers and institutions."""
    db = SessionLocal()
    try:
        # Check if data already exists
        existing_count = db.query(Provider).count()
        if existing_count > 0:
            print(f"Database already has {existing_count} providers. Skipping seed.")
            return

        # Sample addresses
        addresses_data = [
            {
                "street_address_1": "123 Medical Plaza",
                "street_address_2": "Suite 100",
                "city": "San Francisco",
                "state": "CA",
                "zip_code": "94102",
                "country": "USA",
            },
            {
                "street_address_1": "456 Healthcare Blvd",
                "street_address_2": None,
                "city": "Los Angeles",
                "state": "CA",
                "zip_code": "90001",
                "country": "USA",
            },
            {
                "street_address_1": "789 Wellness Way",
                "street_address_2": "Floor 3",
                "city": "New York",
                "state": "NY",
                "zip_code": "10001",
                "country": "USA",
            },
            {
                "street_address_1": "321 Orthopedic Drive",
                "street_address_2": None,
                "city": "Boston",
                "state": "MA",
                "zip_code": "02101",
                "country": "USA",
            },
            {
                "street_address_1": "555 Physical Therapy Lane",
                "street_address_2": "Building B",
                "city": "Seattle",
                "state": "WA",
                "zip_code": "98101",
                "country": "USA",
            },
        ]

        # Create addresses
        addresses = []
        for addr_data in addresses_data:
            address = Address(**addr_data)
            db.add(address)
            addresses.append(address)

        db.commit()
        print(f"Created {len(addresses)} addresses")

        # Sample provider institutions
        institutions_data = [
            {"name": "Pivot Physical Therapy", "website": "https://pivotpt.com", "address": addresses[0]},
            {"name": "Elite Orthopedic Center", "website": "https://eliteortho.com", "address": addresses[1]},
            {
                "name": "Wellness & Recovery Institute",
                "website": "https://wellnessrecovery.com",
                "address": addresses[2],
            },
            {"name": "Boston Sports Medicine", "website": "https://bostonsportsmed.com", "address": addresses[3]},
            {"name": "Pacific Rehabilitation Center", "website": "https://pacificrehab.com", "address": addresses[4]},
            {"name": "Bay Area Chiropractic", "website": "https://bayareachiro.com", "address": addresses[0]},
        ]

        # Create institutions
        institutions = []
        for inst_data in institutions_data:
            institution = ProviderInstitution(
                name=inst_data["name"], website=inst_data["website"], address_id=inst_data["address"].id
            )
            db.add(institution)
            institutions.append(institution)

        db.commit()
        print(f"Created {len(institutions)} provider institutions")

        # Sample providers
        providers_data = [
            {
                "first_name": "Sarah",
                "last_name": "Johnson",
                "email": "sarah.johnson@healthcare.com",
                "phone": "(415) 555-0101",
                "address": addresses[0],
                "institution": institutions[0],  # Pivot PT
            },
            {
                "first_name": "Michael",
                "last_name": "Chen",
                "email": "michael.chen@orthopedics.com",
                "phone": "(213) 555-0102",
                "address": addresses[1],
                "institution": institutions[1],  # Elite Orthopedic Center
            },
            {
                "first_name": "Emily",
                "last_name": "Rodriguez",
                "email": "emily.rodriguez@physicaltherapy.com",
                "phone": "(212) 555-0103",
                "address": addresses[2],
                "institution": institutions[2],  # Wellness & Recovery Institute
            },
            {
                "first_name": "David",
                "last_name": "Williams",
                "email": "david.williams@sportsmedicine.com",
                "phone": "(617) 555-0104",
                "address": addresses[3],
                "institution": institutions[3],  # Boston Sports Medicine
            },
            {
                "first_name": "Jennifer",
                "last_name": "Thompson",
                "email": "jennifer.thompson@rehabilitation.com",
                "phone": "(206) 555-0105",
                "address": addresses[4],
                "institution": institutions[4],  # Pacific Rehabilitation Center
            },
            {
                "first_name": "Robert",
                "last_name": "Martinez",
                "email": "robert.martinez@chiropractor.com",
                "phone": "(415) 555-0106",
                "address": addresses[0],
                "institution": institutions[5],  # Bay Area Chiropractic
            },
            {
                "first_name": "Lisa",
                "last_name": "Anderson",
                "email": "lisa.anderson@wellness.com",
                "phone": "(213) 555-0107",
                "address": addresses[1],
                "institution": institutions[0],  # Pivot PT
            },
            {
                "first_name": "James",
                "last_name": "Taylor",
                "email": "james.taylor@acupuncture.com",
                "phone": "(212) 555-0108",
                "address": addresses[2],
                "institution": institutions[2],  # Wellness & Recovery Institute
            },
        ]

        # Create providers
        for provider_data in providers_data:
            provider = Provider(
                first_name=provider_data["first_name"],
                last_name=provider_data["last_name"],
                email=provider_data["email"],
                phone=provider_data["phone"],
                address_id=provider_data["address"].id,
                institution_id=provider_data["institution"].id,
            )
            db.add(provider)

        db.commit()
        print(f"Successfully created {len(providers_data)} providers")

    except (SQLAlchemyError, KeyError, ValueError, AttributeError) as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("Starting database seed...")
    seed_providers()
    print("Seed complete!")
