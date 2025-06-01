#!/bin/sh

echo "Starting setup..."

# Make frontend/build.bash and backend/build.bash executable
chmod +x frontend/build.bash
chmod +x backend/build.bash
chmod +x _docker-compose/docker-up.bash

# TODO: Check if requirements are installed: docker-compose, docker, node, python, etc.

# if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
#     echo "docker-compose or docker compose could not be found. Please install Docker Compose."
#     exit 1
# fi

# if ! command -v docker &> /dev/null; then
#     echo "Docker could not be found. Please install it first."
#     exit 1
# fi

# Execute the build scripts
echo "Building frontend image..."
cd frontend
./build.bash
cd ..

if [ $? -ne 0 ]; then
    echo "Frontend build failed. Exiting."
    exit 1
fi

echo "Building backend image..."
cd backend
./build.bash
cd ..

if [ $? -ne 0 ]; then
    echo "Backend build failed. Exiting."
    exit 1
fi

# Start the Docker containers
echo "Starting Docker containers..."
cd _docker-compose
./docker-up.bash
cd ..
