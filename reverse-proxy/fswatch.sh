#!/bin/sh
# Reload the nginx service inside the Docker container on nginx.conf file change
# File should be executed from root or project
# fswatch -o ./reverse-proxy/nginx.conf | xargs -n1 -I{} make reload-nginx > fswatch_output &
fswatch -o ./reverse-proxy/nginx.conf | xargs -n1 -I{} make reload-nginx
#kill 18574 18575