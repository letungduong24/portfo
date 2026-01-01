#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Checking if database needs seeding..."
# Run seed script (it will check if data exists)
npm run seed || echo "Seed skipped or already completed"

echo "Starting application..."
exec npm run start:prod
