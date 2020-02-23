#!/bin/bash
while true  
do  
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "$PWD:$PWD" -w="$PWD" docker/compose:1.24.0 -f docker-compose-run-latest.yml pull && docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "$PWD:$PWD" -w="$PWD" docker/compose:1.24.0 -f docker-compose-run-latest.yml up -d
sleep 120
done