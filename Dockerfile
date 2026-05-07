# apisandbox - Staging / Production container
# Multi-stage: deps → build → run
#
# Supply chain: pin base images with digest in production, e.g.
#   FROM node:20-alpine@sha256:... AS deps
# and rebuild when the digest is updated (Renovate/Dependabot).

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Copy only what build needs to reduce the chance of accidentally shipping local secrets.
COPY app ./app
COPY components ./components
COPY config ./config
COPY hooks ./hooks
COPY lib ./lib
COPY prisma ./prisma
COPY public ./public
COPY scripts ./scripts
COPY tests ./tests
COPY middleware.ts ./
COPY next.config.mjs ./
COPY package.json ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY tailwind.config.ts ./
COPY eslint.config.mjs ./
COPY playwright.config.ts ./
COPY vitest.config.ts ./
RUN mkdir -p public
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Patch OS packages in the runtime layer (Alpine security updates) and create non-root user.
RUN apk upgrade --no-cache \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs --chmod=0555 /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs --chmod=0555 /app/.next/static ./.next/static
COPY --from=builder --chmod=0555 /app/public ./public
COPY --from=builder --chmod=0555 /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chmod=0555 /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chmod=0555 /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chmod=0555 /app/prisma ./prisma
COPY --from=builder --chmod=0444 /app/package.json ./
# Harden runtime filesystem: make shipped app code non-writable.
RUN chown -R nextjs:nodejs /app \
  && chmod -R a-w /app \
  && mkdir -p /app/.next/cache \
  && chown -R nextjs:nodejs /app/.next/cache \
  && chmod -R u+w /app/.next/cache
USER nextjs
EXPOSE 4000
ENV PORT=4000
ENV HOSTNAME="0.0.0.0"
# Start server (run migrations from host: DATABASE_URL=... npx prisma migrate deploy)
CMD ["node", "server.js"]
