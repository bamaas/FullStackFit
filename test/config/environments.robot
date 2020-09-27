*** Variables ***
${FRONTEND_URL}             ${ENV_${ENVIRONMENT}.frontend}
${BACKEND_URL}              ${ENV_${ENVIRONMENT}.backend}
${DATABASE_HOST}            ${ENV_${ENVIRONMENT}.database}

&{ENV_PROD}                 frontend=https://fit.basmaas.nl/                 backend=https://fit.basmaas.nl/api             database=localhost
&{ENV_TEST}                 frontend=https://test.fit.basmaas.nl/            backend=https://test.fit.basmaas.nl/api        database=localhost
&{ENV_DEV}                  frontend=localhost:4200                          backend=localhost:5000                         database=localhost:5432