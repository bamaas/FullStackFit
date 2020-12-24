FROM adoptopenjdk:jre-11.0.9.1_1-alpine
LABEL maintainer="Bas Maas"
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]