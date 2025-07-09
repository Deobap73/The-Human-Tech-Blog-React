# Stage 1: Build the Vite React app
FROM node:20-alpine AS builder
WORKDIR /app
# Install dependencies
COPY package*.json ./
RUN npm ci
# Copy configuration and source
COPY tsconfig*.json ./
COPY public ./public
COPY src ./src
# Build static assets
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine AS runner
# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose nginx default port
EXPOSE 80
# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]