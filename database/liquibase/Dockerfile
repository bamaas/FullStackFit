FROM webdevops/liquibase:postgres
ADD changes /liquibase/changelog/
ENV LIQUIBASE_URL=jdbc:postgresql://database:5432/postgres
ENV LIQUIBASE_CHANGELOG=/liquibase/changelog/changelog.xml
ENV LIQUIBASE_USERNAME=postgres
ENV LIQUIBASE_PASSWORD=postgres
ENTRYPOINT ["/opt/docker/bin/entrypoint.sh", "update"]