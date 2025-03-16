# Use the official Node.js alpine slim image as the base image
FROM alpine as lib-builder
LABEL authors="Santiago de Pedro"

# Install yarn, git, and make
RUN apk add --no-cache git make

ENV GPX_ANALYZER_LIB_PATH=/gpx-analyzer/source

WORKDIR /gpx-analyzer

COPY Makefile ./

RUN make clone-gpx-analyzer

FROM node:alpine as api

ARG STRAVA_CLIENT_ID
ARG STRAVA_CLIENT_SECRET
ARG STRAVA_REDIRECT_DOMAIN

RUN apk add --no-cache git make curl bash build-base libffi-dev openssl-dev bzip2-dev zlib-dev readline-dev sqlite-dev

RUN echo "Installing pyenv..."
RUN curl https://pyenv.run | bash

ENV PATH="/root/.pyenv/bin:${PATH}"

ENV GPX_ANALYZER_LIB_PATH=/usr/local/lib/gpx-analyzer

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json Makefile ./

RUN make create-env-file \
    ENV_FILE=.env.production.local \
    STRAVA_CLIENT_ID=${STRAVA_CLIENT_ID} \
    STRAVA_CLIENT_SECRET=${STRAVA_CLIENT_SECRET} \
    STRAVA_REDIRECT_DOMAIN=${STRAVA_REDIRECT_DOMAIN}

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .
COPY --from=lib-builder /gpx-analyzer/source ${GPX_ANALYZER_LIB_PATH}

RUN make configure-gpx-analyzer

# Expose the application port
EXPOSE 3000

# Specify the command to run the application
CMD ["yarn", "dev"]