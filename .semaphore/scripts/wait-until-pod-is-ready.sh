#!/bin/bash
# $1 = namespace
# $2 = app
while [[ $(kubectl get pods -n $1 --insecure-skip-tls-verify -l app=$2 -o 'jsonpath={..status.conditions[?(@.type=="Ready")].status}') != "True" ]]; do echo "waiting for pod" && sleep 1; done