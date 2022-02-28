
# Stage 1: Build the image
# GET the base image from node 16.14.0-alpine3.14
FROM node:16.14.0-alpine3.14@sha256:98a87dfa76dde784bb4fe087518c839697ce1f0e4f55e6ad0b49f0bfd5fbe52c AS builder

# Adds metadata that will label the image
LABEL maintainer="Luan Lima Campos <llima-campos@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Use /app as our working directory
WORKDIR /app

# Copy package and package-lock into the workdir
COPY package*.json /app/

# Install all dependencies
RUN npm ci

# Stage 2: The production image
# GET the base image from node 16.14.0-alpine3.14
FROM node:16.14.0-alpine3.14@sha256:98a87dfa76dde784bb4fe087518c839697ce1f0e4f55e6ad0b49f0bfd5fbe52c

# Set environment variables
ENV PORT 8080 \
  NPM_CONFIG_LOGLEVEL=warn \
  NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Use a least-privileged user
USER node

# Copy the app folder from the cached builder stage and change the ownership to the node user
COPY --chown=node:node --from=builder /app /app

# Copy the src code into the image and change the ownership to the node user
COPY --chown=node:node ./src ./src

# Execute command to start the server. Docker run with --init argument replace 
# the need of setting a tini ENTRYPOINT in this file. A dumb-init could also used here.
CMD [ "node", "src/index.js" ]

# We run our service on port 8080
EXPOSE 8080

# Make sure that the server is healthy
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \ 
  CMD curl --fail localhost:8080 || exit 1