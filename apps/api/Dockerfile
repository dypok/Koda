# ==============================================================================
# KODA PLATFORM — BACKEND API DOCKERFILE (apps/api)
# Multi-stage build for NestJS in pnpm monorepo with Prisma & Siigo Object Storage
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Base image with system dependencies & global pnpm
# ------------------------------------------------------------------------------
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat openssl
RUN npm install -g pnpm@12.0.0

WORKDIR /app

# Configure resilient network timeouts for package downloads
RUN pnpm config set fetch-timeout 600000 && \
    pnpm config set fetch-retries 5 && \
    pnpm config set network-concurrency 2

# ------------------------------------------------------------------------------
# Stage 2: Install dependencies (only api and shared packages)
# ------------------------------------------------------------------------------
FROM base AS dependencies

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/api/package.json ./apps/api/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm --filter api... install --frozen-lockfile

# ------------------------------------------------------------------------------
# Stage 3: Build application & shared packages
# ------------------------------------------------------------------------------
FROM base AS builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages/types/node_modules ./packages/types/node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types ./packages/types
COPY apps/api ./apps/api

# Build shared types package
RUN pnpm --filter @koda/types build

# Generate Prisma Client & compile NestJS API
RUN pnpm --filter api build

# ------------------------------------------------------------------------------
# Stage 4: Production Runner
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Create unprivileged system user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy dependencies, shared packages, Prisma schemas, and built artifacts
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/packages ./packages
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

USER nestjs

EXPOSE 4000

CMD ["node", "apps/api/dist/main.js"]
