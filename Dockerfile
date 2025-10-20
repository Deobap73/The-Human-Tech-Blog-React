# /The-Human-Tech-Blog-React/Dockerfile
# Build with Google's mirror to avoid Docker Hub 503s

# ---- Stage 1: Build the Vite React app ----
FROM mirror.gcr.io/library/node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy sources and config
COPY tsconfig*.json ./
COPY public ./public
COPY src ./src

# Build static assets
RUN npm run build

# ---- Stage 2: Serve with nginx ----
FROM mirror.gcr.io/library/nginx:1.27-alpine AS runner

# (Opcional) custom nginx.conf para SPA (history API); default serve também funciona
# COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
