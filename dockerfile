# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Vite app
RUN npm run build

# Install serve to host static files
RUN npm install -g serve

# Expose port 8080
EXPOSE 8080

# Start the app
CMD ["serve", "-s", "dist", "-l", "8080"]
