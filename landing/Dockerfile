FROM nginx:1.19.6-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY public_html /usr/share/nginx/public_html

WORKDIR /usr/share/nginx/public_html

CMD nginx -g 'daemon off;'