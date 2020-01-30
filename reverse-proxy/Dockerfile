FROM nginx:stable-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# - Serve
# Replace $PORT in nginx.conf with the environment variable $PORT
# This is needed because Heroku sets the env var $PORT on runtime
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf && nginx -g 'daemon off;'