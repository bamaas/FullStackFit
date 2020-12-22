#!/bin/bash
# $1 = namespace
# $2 = workload
# $3 = name
# kubectl -n $1 rollout restart $2 $3 --insecure-skip-tls-verify && kubectl -n $1 rollout status $2/$3 --insecure-skip-tls-verify
kubectl -n $1 rollout status $2/$3 --insecure-skip-tls-verify