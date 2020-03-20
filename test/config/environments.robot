*** Variables ***
${FRONTEND_URL}        ${ENV_${ENVIRONMENT}.frontend}
${BACKEND_URL}         ${ENV_${ENVIRONMENT}.backend}

&{ENV_LOCALHOST}       frontend=http://localhost:80                 backend=http://localhost:80/api
&{ENV_DOCKER}          frontend=http://host.docker.internal:80      backend=http://host.docker.internal:80/api
&{ENV_PROD}            frontend=http://35.184.162.177               backend=http://35.184.162.177/api