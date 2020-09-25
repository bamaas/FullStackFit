*** Variables ***
${FRONTEND_URL}             ${ENV_${ENVIRONMENT}.frontend}
${BACKEND_URL}              ${ENV_${ENVIRONMENT}.backend}
${DATABASE_HOST}            ${ENV_${ENVIRONMENT}.database}

&{ENV_DOCKER}               frontend=http://host.docker.internal:4200       backend=http://host.docker.internal:80/api      database=localhost
&{ENV_DOCKERDEV}            frontend=http://host.docker.internal:4200       backend=http://host.docker.internal:5000        database=localhost
&{ENV_LOCALHOSTNODOCKER}    frontend=http://localhost:4200                  backend=http://localhost:5000                   database=localhost

# Kubernetes
&{ENV_PROD}                 frontend=https://fit.basmaas.nl/                 backend=https://fit.basmaas.nl/api
&{ENV_TEST}                 frontend=https://test.fit.basmaas.nl/            backend=https://test.fit.basmaas.nl/api        database=localhost

# Pipeline
&{ENV_LOCALHOST}            frontend=http://localhost:80                    backend=http://localhost:80/api                 database=localhost