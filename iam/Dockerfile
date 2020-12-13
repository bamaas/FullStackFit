FROM jboss/keycloak:11.0.2
USER jboss
ENV PROXY_ADDRESS_FORWARDING=true
COPY ./realm-export.json /tmp/realm-export.json
ENV KEYCLOAK_IMPORT="/tmp/realm-export.json -Dkeycloak.profile.feature.upload_scripts=enabled"