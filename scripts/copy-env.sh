#!/bin/bash

SCRIPT_DIR="$(dirname "$(realpath "$0")")"

for p in "$SCRIPT_DIR"/../packages/*; do
  if [ -f "$p"/.env.defaults ]; then
    cp -v "$p"/.env.defaults "$p"/.env
  fi
done
