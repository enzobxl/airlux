#!/bin/bash

KEYS_DIR="/var/raspberry-pub-keys"

AUTHORIZED_KEYS_FILE="/root/.ssh/authorized_keys"

if [ ! -d "$KEYS_DIR" ]; then
  echo "$KEYS_DIR directory does not exist."
  exit 1
fi

for key_file in "$KEYS_DIR"/*; do
  if [ -f "$key_file" ]; then
    cat "$key_file" >> "$AUTHORIZED_KEYS_FILE"
    rm "$key_file"
  fi
done
