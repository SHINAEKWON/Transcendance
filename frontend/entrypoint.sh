#!/bin/sh

INPUT_FILE="/etc/nginx/nginx.conf.template"
OUTPUT_FILE="/etc/nginx/nginx.conf"

# Check if the input file exists
if [ ! -f "$INPUT_FILE" ]; then
  echo "Input file $INPUT_FILE not found!"
  exit 1
fi

# Copy the input file to the output file (just in case we need the original unchanged)
cp "$INPUT_FILE" "$OUTPUT_FILE"

# Loop through all environment variables
env | while IFS='=' read -r var value; do
  # Check if the environment variable is not empty
  if [ -n "$value" ]; then
    # Replace $var with the actual value if the variable is set
    sed -i "s|\$$var|$value|g" "$OUTPUT_FILE"
  fi
done

exec nginx -g 'daemon off;'