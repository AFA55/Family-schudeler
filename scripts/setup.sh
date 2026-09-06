#!/bin/bash
set -euo pipefail

# One-command setup for FamilySync
# Usage: ./scripts/setup.sh

echo "Setting up FamilySync..."

# Ensure we run from the repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

# Check for required tools
command -v node >/dev/null 2>&1 || { echo "Error: Node.js is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "Error: npm is required but not installed."; exit 1; }

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "Error: Node.js 18+ is required. Found: $(node -v)"
  exit 1
fi

# Check for .env
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "Created .env from .env.example -- please fill in your keys and re-run this script."
  else
    echo "Error: No .env or .env.example found. Create a .env file with required environment variables."
  fi
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate --schema=packages/database/prisma/schema.prisma

# Push schema to database
echo "Pushing database schema..."
npx prisma db push --schema=packages/database/prisma/schema.prisma

# Seed database (optional, skip if no seed script)
if npx prisma db seed --schema=packages/database/prisma/schema.prisma 2>/dev/null; then
  echo "Database seeded successfully."
else
  echo "Skipping database seed (no seed script configured or seed failed)."
fi

echo ""
echo "FamilySync is ready!"
echo "Run 'npm run dev:web' to start the web app"
echo "Run 'npm run dev:mobile' to start the mobile app"
