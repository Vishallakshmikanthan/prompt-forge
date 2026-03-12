# Production Dockerfile for PromptForge Backend
FROM node:18-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code (including Prisma schema relative to backend)
# Note: The context should be the project root if we want to copy the prisma schema easily,
# or we copy it from the relative path.
# In docker-compose, we can set the context and dockerfile path.
# If we run docker build from the backend directory, we need the schema.
COPY src ./src
COPY ../database/prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4000

# Start command
CMD ["npm", "start"]
