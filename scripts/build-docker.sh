#!/bin/bash


docker build -t diamonds2_base:latest -f ../.docker/dockerfiles/base ..
docker-compose up --build
