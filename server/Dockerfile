# Use an official lightweight Node image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Set environment to production 
ENV NODE_ENV=production

# Expose the port your server uses
EXPOSE 4000

# Start the server
CMD ["npm", "start"]
