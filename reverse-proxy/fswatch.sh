#!/bin/sh
####################################################################################
# Reload the nginx service inside the Docker container on nginx.conf file change
# Should be run fom root of project
####################################################################################
CURDIR=$(pwd | grep -o '[^/]*$')
if [ $CURDIR != 'FullStackFit' ]; then
    printf "Please run this script from ./FullStackfit (root). \nCURDIR: $CURDIR"
    exit 1
else
    fswatch -o ./reverse-proxy/nginx.conf | xargs -n1 -I{} docker exec -it fit_reverseproxy-dev nginx -s reload
fi
# Without output in stdout:
# fswatch -o ./reverse-proxy/nginx.conf | xargs -n1 -I{} make reload-nginx > fswatch_output &
# To kill get PID and run: kill 18574 18575