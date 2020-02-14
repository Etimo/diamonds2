#!/bin/bash

COMMIT_HASH="$1"

if [ "$COMMIT_HASH" == "" ]; then
    echo "Missing commit hash. Cannot do anything"
    exit 1
fi

echo "Deploying app for hash $COMMIT_HASH..."

# Pull new images from docker hub
# docker pull etimodanielwinther/diamonds2_frontend:git-$COMMIT_HASH
# docker pull etimodanielwinther/diamonds2_backend:git-$COMMIT_HASH

# Redeploy
echo TODO
