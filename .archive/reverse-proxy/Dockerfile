FROM nginx:1.19.6-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Replace $PORT in nginx.conf with the environment variable $PORT
#CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf && nginx -g 'daemon off;'
CMD nginx -g 'daemon off;'