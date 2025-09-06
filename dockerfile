# Use official Node.js image as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Build the Vite app
RUN npm run build

# Use a lightweight web server to serve the built files
RUN npm install -g serve

# Expose the default port
EXPOSE 8080

# Start the app
CMD ["serve", "-s", "dist", "-l", "8080"]
