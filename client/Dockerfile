# -------- Stage 1: Build the Vite app --------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source code (including .env for VITE_ variables)
COPY . .

# Build the production bundle
RUN npm run build

# -------- Stage 2: Serve the built app --------
FROM node:20-alpine

WORKDIR /app

# Simple static server
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port for the static server
EXPOSE 5173

# Serve the built app on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
