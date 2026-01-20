#!/usr/bin/env python3
"""
Import provider institutions from JSON into the database.

This script reads preprocessed JSON data (with UUIDs) and imports provider
institutions into the database. It parses address strings, checks for duplicates
by UUID, and creates both Address and ProviderInstitution records.
"""

import asyncio
import json
import logging
import re
import sys
import uuid as uuid_lib
from pathlib import Path
from typing import Dict

import usaddress

# Add the app directory to the path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import AsyncSessionLocal
from app.models.address import Address
from app.models.provider_institution import ProviderInstitution
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def parse_address(address_str: str) -> Dict[str, str]:
    """
    Parse address string into components.

    Args:
        address_str: Address string like "5454 Wisconsin Ave #1700, Chevy Chase, MD 20815"

    Returns:
        Dictionary with street_address_1, street_address_2, city, state, zip_code, country

    Raises:
        ValueError: If address cannot be parsed
    """
    # Split on last comma to separate street from city/state/zip
    parts = address_str.rsplit(",", 1)
    if len(parts) != 2:
        raise ValueError(f"Address doesn't have expected comma separator: {address_str}")

    street_part = parts[0].strip()
    location_part = parts[1].strip()

    # Parse city, state, zip from location part
    # Pattern: "City Name, ST 12345" or "City Name ST 12345"
    match = re.match(r"^(.+?)\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$", location_part)
    if not match:
        raise ValueError(f"Could not parse city/state/zip: {location_part}")

    city = match.group(1).strip()
    state = match.group(2)
    zip_code = match.group(3)

    # Parse street address using usaddress
    street_address_1 = street_part
    street_address_2 = None

    try:
        parsed = usaddress.parse(street_part)

        # Separate main address from suite/apt/unit numbers
        main_parts = []
        secondary_parts = []

        for component, label in parsed:
            if label in ["OccupancyType", "OccupancyIdentifier", "SubaddressType", "SubaddressIdentifier"]:
                secondary_parts.append(component)
            else:
                main_parts.append(component)

        if main_parts:
            street_address_1 = " ".join(main_parts)
        if secondary_parts:
            street_address_2 = " ".join(secondary_parts)

    except usaddress.RepeatedLabelError as e:
        # If usaddress can't parse it cleanly, use the original
        logger.warning(f"usaddress parsing issue for '{street_part}': {e}")
        street_address_1 = street_part
        street_address_2 = None

    return {
        "street_address_1": street_address_1,
        "street_address_2": street_address_2,
        "city": city,
        "state": state,
        "zip_code": zip_code,
        "country": "USA",
    }


async def import_institutions():
    """Import provider institutions from preprocessed JSON file."""
    backend_dir = Path(__file__).parent.parent
    json_file = backend_dir / "assets" / "mesfin_preprocessed.json"

    # Check if file exists
    if not json_file.exists():
        logger.error(f"Preprocessed file not found: {json_file}")
        logger.error("Please run preprocessing.py first to add UUIDs")
        return

    # Load JSON data
    logger.info(f"Loading data from {json_file}")
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    logger.info(f"Found {len(data)} entries to process")

    # Statistics
    stats = {"created": 0, "skipped": 0, "errors": 0}

    # Import data using async database session
    async with AsyncSessionLocal() as session:
        async with session.begin():
            for record in data:
                # Validate required fields
                if "id" not in record:
                    raise ValueError(f"Missing UUID for: {record.get('name', 'Unknown')}")

                if "name" not in record:
                    raise ValueError(f"Missing name for record with ID: {record['id']}")

                institution_uuid = uuid_lib.UUID(record["id"])

                # Check if institution already exists
                result = await session.execute(
                    select(ProviderInstitution).where(ProviderInstitution.id == institution_uuid)
                )
                existing = result.scalar_one_or_none()

                if existing:
                    logger.info(f"Skipping existing institution: {record['name']}")
                    stats["skipped"] += 1
                    continue

                # Parse address
                address_id = None
                if record.get("address"):
                    address_data = parse_address(record["address"])
                    address = Address(**address_data)
                    session.add(address)
                    await session.flush()  # Get the address ID
                    address_id = address.id

                # Create ProviderInstitution record
                institution = ProviderInstitution(
                    id=institution_uuid,
                    name=record["name"],
                    type=record.get("type"),
                    phone=record.get("phone"),
                    email=record.get("email"),
                    website=record.get("website"),
                    address_id=address_id,
                )
                session.add(institution)
                stats["created"] += 1
                logger.info(f"Created institution: {record['name']}")

            # Commit is automatic when exiting session.begin() context
            logger.info("Committing transaction...")

    # Print summary
    logger.info("\n" + "=" * 60)
    logger.info("IMPORT COMPLETE")
    logger.info("=" * 60)
    logger.info(f"Created:  {stats['created']}")
    logger.info(f"Skipped:  {stats['skipped']}")
    logger.info(f"Errors:   {stats['errors']}")
    logger.info(f"Total:    {len(data)}")
    logger.info("=" * 60)


if __name__ == "__main__":
    asyncio.run(import_institutions())
