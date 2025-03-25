FROM node:alpine as builder

ARG API_URL

ENV ENV_FILE=.env.production.local

RUN apk add --no-cache make

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn-lock.json to the container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

RUN make create-env-file

# Build the app
RUN yarn build

FROM nginx:alpine

ARG API_URL

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/.env.production.local /usr/share/nginx/html

RUN apk add --no-cache make

COPY Makefile ./

# Add custom nginx configuration
COPY nginx/web.conf /etc/nginx/conf.d/default.conf

RUN make configure-nginx

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]