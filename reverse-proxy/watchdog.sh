#!/bin/sh
# Reload the nginx service inside the Docker container on nginx.conf file change
# File should be executed from root or project
while true; do find reverse-proxy/nginx.conf | entr make reload-nginx; done