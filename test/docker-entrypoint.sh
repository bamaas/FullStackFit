#!/bin/bash
set -e

if [ "$#" -eq 0 ] || [ "${1#-}" != "$1" ] || [ -e "$1" ]; then
    exec robot "$@"
else
    exec "$@"
fi
