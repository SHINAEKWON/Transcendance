#!/bin/bash

# Path to database
DB_PATH="/data/user_db.sqlite"

# SQL command to create the table
SQL_COMMAND="
CREATE TABLE IF NOT EXISTS users (
  nickname TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);
"

# Ensure the /data directory exists
# -p: create parent directories as well
mkdir -p "$(dirname "$DB_PATH")"

# Create the database file (if it doesn't exist)
if [ ! -f "$DB_PATH" ]; then
  echo "Creating new SQLite database at $DB_PATH"
  sqlite3 "$DB_PATH" ".databases" # Just open and close to create the file
else
  echo "Database already exists at $DB_PATH"
fi

# Create the table
echo "Creating 'users' table if not exists..."
sqlite3 "$DB_PATH" "$SQL_COMMAND"

echo "Database initialization complete."