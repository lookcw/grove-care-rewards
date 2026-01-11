#!/usr/bin/env python3
"""
Preprocessing script to add UUIDs to provider institution JSON data.

This script reads the source JSON file and adds a unique UUID to each entry,
creating a preprocessed version that can be used for idempotent imports.
"""
import json
import uuid
from pathlib import Path


def add_uuids_to_json():
    """Add UUIDs to each entry in the provider institutions JSON file."""
    # Get the backend directory
    backend_dir = Path(__file__).parent.parent

    # Define file paths
    source_file = backend_dir / "assets" / "mesfin.json"
    output_file = backend_dir / "assets" / "mesfin_preprocessed.json"

    # Check if source file exists
    if not source_file.exists():
        print(f"Error: Source file not found at {source_file}")
        return

    # Read the source JSON
    print(f"Reading source file: {source_file}")
    with open(source_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data)} entries in source file")

    # Add UUID to each entry
    for entry in data:
        if 'id' not in entry:
            entry['id'] = str(uuid.uuid4())
            print(f"Added UUID to: {entry['name']}")
        else:
            print(f"UUID already exists for: {entry['name']}")

    # Write the preprocessed JSON
    print(f"\nWriting preprocessed file: {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nPreprocessing complete!")
    print(f"Preprocessed file created with {len(data)} entries")


if __name__ == "__main__":
    add_uuids_to_json()
