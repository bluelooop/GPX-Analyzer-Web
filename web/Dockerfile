FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn-lock.json to the container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Expose the application port
EXPOSE 5173

# Specify the command to run the application
CMD ["yarn", "dev", "--host"]