*** Variables ***
${FRONTEND_URL}        ${ENV_${ENVIRONMENT}.frontend}
${BACKEND_URL}         ${ENV_${ENVIRONMENT}.backend}

# Test
&{ENV_LOCALHOST}       frontend=http://localhost:4200                 backend=http://localhost:80/api
&{ENV_LOCALHOSTNODOCKER}    frontend=http://localhost:4200          backend=http://localhost:5000
&{ENV_DOCKER}          frontend=host.docker.internal:4200             backend=host.docker.internal:80/api

# Prod
&{ENV_PROD}            frontend=https:/fit.basmaas.n/               backend=https://fit.basmaas.nl/api