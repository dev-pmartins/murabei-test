#!/bin/sh

echo "Starting setup..."

# Make frontend/build.bash and backend/build.bash executable
chmod +x frontend/build.bash
chmod +x backend/build.bash
chmod +x _docker-compose/docker-up.bash

# TODO: Check if requirements are installed: docker-compose, docker, node, python, etc.

if ! command -v docker-compose &> /dev/null; then
    echo "docker-compose could not be found. Please install it first."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "Docker could not be found. Please install it first."
    exit 1
fi

# Execute the build scripts
echo "Building frontend image..."
./frontend/build.bash

if [ $? -ne 0 ]; then
    echo "Frontend build failed. Exiting."
    exit 1
fi

echo "Building backend image..."
./backend/build.bash

if [ $? -ne 0 ]; then
    echo "Backend build failed. Exiting."
    exit 1
fi

# Start the Docker containers
echo "Starting Docker containers..."
_docker-compose/docker-up.bash
