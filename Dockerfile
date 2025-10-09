# Multi-stage build for React FastRTC Frontend
# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy ONLY package files first (for better layer caching)
COPY package*.json ./

# Install dependencies (including devDependencies needed for build)
# This layer will be cached if package.json doesn't change
RUN npm install --legacy-peer-deps

# Copy source code AFTER npm install (improves cache hit rate)
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app from build stage (Vite builds to dist/)
COPY --from=build /app/dist /usr/share/nginx/html

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80 (will be mapped to 7864 in docker-compose)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]