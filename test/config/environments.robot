*** Variables ***
${FRONTEND_URL}        ${ENV_${ENVIRONMENT}.frontend}
${BACKEND_URL}         ${ENV_${ENVIRONMENT}.backend}
${DATABASE_HOST}        ${ENV_${ENVIRONMENT}.database}

# Test
&{ENV_LOCALHOST}            frontend=http://localhost:80                 backend=http://localhost:80/api                database=localhost
&{ENV_LOCALHOSTNODOCKER}    frontend=http://localhost:4200               backend=http://localhost:5000                  database=localhost
&{ENV_DOCKER}               frontend=host.docker.internal:4200           backend=host.docker.internal:80/api            database=database

# Prod
&{ENV_PROD}            frontend=https:/fit.basmaas.n/               backend=https://fit.basmaas.nl/api