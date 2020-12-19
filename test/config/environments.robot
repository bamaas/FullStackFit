*** Variables ***
${FRONTEND_URL}             ${ENV_${ENVIRONMENT}.frontend}
${BACKEND_URL}              ${ENV_${ENVIRONMENT}.backend}
${AUTH_URL}                 ${ENV_${ENVIRONMENT}.auth}
${DATABASE_HOST}            ${ENV_${ENVIRONMENT}.database}

&{ENV_PROD}                 frontend=https://fit.basmaas.nl/                 backend=https://fit.basmaas.nl/api             database=localhost              auth=https://fit.basmaas.nl/auth
&{ENV_TEST}                 frontend=https://test.fit.basmaas.nl/            backend=https://test.fit.basmaas.nl/api        database=localhost              auth=https://test.fit.basmaas.nl/auth
&{ENV_DEV}                  frontend=http://localhost:4200                   backend=http://localhost:5000                  database=localhost              auth=http://localhost:8080/auth