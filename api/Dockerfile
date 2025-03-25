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

RUN apk add --no-cache git make curl bash build-base libffi-dev openssl-dev bzip2-dev zlib-dev readline-dev sqlite-dev xz-dev

RUN echo "Installing pyenv..."
RUN curl https://pyenv.run | bash

ENV PATH="/root/.pyenv/bin:${PATH}"

ENV GPX_ANALYZER_LIB_PATH=/usr/local/lib/gpx-analyzer
ENV PYTHON_PATH=${GPX_ANALYZER_LIB_PATH}/.venv/bin/python
ENV ENV_FILE=.env.production.local

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn-lock.json to the container
COPY package.json yarn.lock Makefile ./

# Install dependencies
RUN yarn install

COPY --from=lib-builder /gpx-analyzer/source ${GPX_ANALYZER_LIB_PATH}
RUN make configure-gpx-analyzer

# Copy the rest of the application code to the container
COPY . .

RUN make create-env-file

# Expose the application port
EXPOSE 3000

# Specify the command to run the application
CMD ["yarn", "dev"]