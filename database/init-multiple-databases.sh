#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
until psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "PostgreSQL is up - executing initialization scripts"

# Create evolution_api database
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE DATABASE evolution_api;"

# Create getnexo user for evolution_api
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE USER getnexo WITH SUPERUSER PASSWORD 'getnexo2026';"

# Grant privileges to getnexo user on evolution_api database
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "GRANT ALL PRIVILEGES ON DATABASE evolution_api TO getnexo;"

# Grant schema permissions on evolution_api database
psql -U "$POSTGRES_USER" -d evolution_api -c "GRANT ALL ON SCHEMA public TO getnexo;"
psql -U "$POSTGRES_USER" -d evolution_api -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO getnexo;"
psql -U "$POSTGRES_USER" -d evolution_api -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO getnexo;"
psql -U "$POSTGRES_USER" -d evolution_api -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO getnexo;"
psql -U "$POSTGRES_USER" -d evolution_api -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO getnexo;"

>&2 echo "Multiple databases initialization completed"