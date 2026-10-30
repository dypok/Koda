# ==============================================================================
# KODA PLATFORM — FRONTEND WEB DOCKERFILE (apps/web)
# Multi-stage standalone build for Next.js in pnpm monorepo
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Base image with system dependencies & global pnpm
# ------------------------------------------------------------------------------
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@12.0.0

WORKDIR /app

# Configure resilient network timeouts for package downloads
RUN pnpm config set fetch-timeout 600000 && \
    pnpm config set fetch-retries 5 && \
    pnpm config set network-concurrency 2

# ------------------------------------------------------------------------------
# Stage 2: Install dependencies (only web and shared packages)
# ------------------------------------------------------------------------------
FROM base AS dependencies

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/web/package.json ./apps/web/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm --filter web... install --frozen-lockfile

# ------------------------------------------------------------------------------
# Stage 3: Build application & shared packages
# ------------------------------------------------------------------------------
FROM base AS builder

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages/types/node_modules ./packages/types/node_modules
COPY --from=dependencies /app/apps/web/node_modules ./apps/web/node_modules

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types ./packages/types
COPY apps/web ./apps/web
COPY content ./content

# Build shared types
RUN pnpm --filter @koda/types build

# Build Next.js application in standalone mode
RUN pnpm --filter web build

# ------------------------------------------------------------------------------
# Stage 4: Production Runner
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Create unprivileged system user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output bundle and static assets
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
