FROM nginx:1.19.6-alpine
LABEL maintainer="Bas Maas"

COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*

WORKDIR /usr/share/nginx/html
COPY dist/angu/ .

ENV PORT=4200

# Replace $PORT in nginx.conf with the environment variable $PORT
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf && nginx -g 'daemon off;'