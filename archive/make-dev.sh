#!/bin/bash 
# Had to put all this logic in a .sh file because in the Make file it isn't working because of the ${PWD##*/}
docker-compose -f docker-compose-dev.yml build
# Copy the node_modules folder to host
    # When this project is pulled from Git the node_modules folder is missing. As it is in the .Gitignore.
    # On Dev we mount the PWD of frontend. So that is the same location as where the node_modules folder should be.
    # This would cause the application not being able to run as the node_modules (dependencies) are missing.
    # So we copy the node_modules from the Docker container to the host and then start the container.
docker create -ti --name frontend-dev-node_modules ${PWD##*/}_frontend bash
docker cp frontend-dev-node_modules:/app/node_modules/ ./frontend/
docker rm -f frontend-dev-node_modules
# Do the same trick for the backend
docker create -ti --name backend-dev_env ${PWD##*/}_backend bash
docker cp backend-dev_env:/src/env/ ./backend/
docker rm -f backend-dev_env
# Start dev environment
docker-compose -f docker-compose-dev.yml up