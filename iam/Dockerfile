FROM jboss/keycloak:11.0.2
USER jboss
ENV PROXY_ADDRESS_FORWARDING=true
COPY ./themes/DoYouEvenTrack /opt/jboss/keycloak/themes/FitTrack
COPY ./realm-export.json /tmp/realm-export.json
COPY ./plugins/event_listener/target/event-listener.jar /opt/jboss/keycloak/standalone/deployments/
ENV KEYCLOAK_IMPORT="/tmp/realm-export.json -Dkeycloak.profile.feature.upload_scripts=enabled"