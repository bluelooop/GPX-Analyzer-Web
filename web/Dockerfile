FROM node:alpine as builder

ARG API_URL

ENV ENV_FILE=.env.production.local

RUN apk add --no-cache make

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn-lock.json to the container
COPY Makefile package.json yarn.lock ./

# Install dependencies
RUN yarn install

RUN make create-env-file

# Copy the rest of the application code to the container
COPY . .

# Build the app
RUN yarn build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/.env.production.local /usr/share/nginx/html

# Add custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/api.conf /etc/nginx/conf.d/api.conf
COPY nginx/web.conf /etc/nginx/conf.d/web.conf
RUN rm -f /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]