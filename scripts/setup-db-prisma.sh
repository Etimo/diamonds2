#!/bin/bash

PORT=5433 # Port for postgrestdb
ATTEMPTS=10
ATTEMPT=1

echo "Navigating to directory: packages/backend"
cd packages/backend || exit 1

echo "Install dependencies"
yarn install

echo "Waiting database server to launch on $PORT..."

while ! nc -z localhost $PORT ; do
  sleep 2
  echo "Waiting for database server attempt $ATTEMPT / $ATTEMPTS"
  (( ATTEMPT++ ))
  if [ "$ATTEMPT" -eq $ATTEMPTS ]; then
    echo "Database server failed to launch"
    exit 1
  fi
done

echo "Update the database schema"
npx prisma db push

echo "Seed the database"
npx prisma db seed
