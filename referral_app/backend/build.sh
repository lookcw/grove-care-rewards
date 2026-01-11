#!/bin/bash
set -e

echo "Building referral app frontend..."
cd ../frontend
npm install
npm run build

echo "Copying build files to backend/static..."
rm -rf ../backend/static
cp -r dist ../backend/static

echo "Build complete! Referral app frontend built and copied to backend/static/"
