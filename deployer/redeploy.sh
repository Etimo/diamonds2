#!/bin/bash

COMMIT_HASH="$1"
BRANCH="$2"

if [ "$COMMIT_HASH" == "" ]; then
    echo "Missing commit hash. Cannot do anything"
    exit 1
fi

if [ "$BRANCH" == "" ]; then
    echo "Missing branch. Cannot do anything"
    exit 1
fi

echo "Deploying app for hash $COMMIT_HASH..."

# Pull new images from docker hub
docker pull etimodanielwinther/diamonds2_frontend:git-$COMMIT_HASH
docker pull etimodanielwinther/diamonds2_backend:git-$COMMIT_HASH

# Redeploy
export DIAMONDS_DOCKER_TAG=git-$COMMIT_HASH
(cd .. && docker-compose -f docker-compose.prod-run.yml down)
(cd .. && docker-compose -f docker-compose.prod-run.yml up -d)

# Get my hostname
HOST=$(curl --connect-timeout 5 http://169.254.169.254/latest/meta-data/public-hostname)

if [ ! -z "$SLACK_URL" ]; then
    # Post status to slack
    node slack.js "$SLACK_URL" 1 "$COMMIT_HASH" "branch" "$HOST"
else
    echo "Missing SLACK_URL, not posting to slack"
fi
