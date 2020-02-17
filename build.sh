#!/bin/bash

# Get git hash
HASH=$(git rev-parse HEAD)
echo "Git hash: $HASH"

# Login to docker
echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin

docker-compose -f docker-compose.prod-build.yml build --parallel

echo "Tagging images..."
docker tag diamonds2_frontend:latest etimodanielwinther/diamonds2_frontend:latest
docker tag diamonds2_frontend:latest etimodanielwinther/diamonds2_frontend:git-$HASH
docker tag diamonds2_backend:latest etimodanielwinther/diamonds2_backend:latest
docker tag diamonds2_backend:latest etimodanielwinther/diamonds2_backend:git-$HASH

echo "Pushing images..."
docker push etimodanielwinther/diamonds2_frontend:latest
docker push etimodanielwinther/diamonds2_frontend:git-$HASH
docker push etimodanielwinther/diamonds2_backend:latest
docker push etimodanielwinther/diamonds2_backend:git-$HASH
