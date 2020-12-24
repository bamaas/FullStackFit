# Step 1: Build the app in image 'builder'
FROM node:12.8-alpine AS builder

WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json package-lock.json ./
RUN npm ci --no-progress \
    && npm install -g @angular/cli@7.3.9 --no-progress

COPY . ./

ARG config
# Check for mandatory build arguments
RUN : "${config:?Build argument needs to be set and non-empty.}"
RUN ng build --configuration="$config" --no-progress

# Step 2: Use build output from 'builder'
FROM nginx:1.19.6-alpine
LABEL maintainer="Bas Maas"

COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*

WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist/angu/ .

ENV PORT=4200

# Replace $PORT in nginx.conf with the environment variable $PORT
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf && nginx -g 'daemon off;'