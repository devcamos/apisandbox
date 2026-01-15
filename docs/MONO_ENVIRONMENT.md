# Mono-Environment Framework

This application uses a **mono-environment framework** where the same codebase works across all environments without code changes.

## Core Principle

**Configure through environment variables, not code changes.**

## Architecture

```
Same Codebase
    ↓
Environment Variables
    ↓
├── Local → Docker PostgreSQL (localhost:5433)
├── Preview → Vercel Postgres (PR branches)
├── Staging → Vercel Postgres (custom environment)
└── Production → Vercel Postgres (main branch)
```

## Supported Environments

- **Local**: Local development with Docker PostgreSQL
- **Preview**: Vercel preview deployments (automatic for PR branches)
- **Staging**: Vercel custom environment (optional, requires Pro/Enterprise plan)
- **Production**: Vercel production deployments (main branch)

## Key Benefits

✅ **Same Code Everywhere**: No environment-specific code paths  
✅ **Easy Deployment**: Just change `DATABASE_URL`  
✅ **Team Flexibility**: Each developer can use their preferred local setup  
✅ **No Code Changes**: Switch between environments by changing env vars  
✅ **Vercel-Ready**: Production setup matches Vercel's requirements  

## Database Strategy

### All Environments Use PostgreSQL

- **Local**: Docker PostgreSQL or local installation
- **Production**: Vercel Postgres (managed)
- **Same Schema**: `prisma/schema.prisma` uses `provider = "postgresql"`

### Why PostgreSQL Everywhere?

1. **Vercel Compatibility**: Vercel requires PostgreSQL (no SQLite support)
2. **Production-Ready**: Same database in dev and prod
3. **Feature Parity**: PostgreSQL features available everywhere
4. **Easy Migration**: No schema changes between environments

## Environment Configuration

### Local Development

```bash
# Start PostgreSQL (Docker)
npm run db:up

# Setup environment
npm run env:local

# Edit .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/apisandbox_dev"
AUTH_SECRET="local-dev-secret"
```

### Production (Vercel)

**Environment Variables in Vercel Dashboard:**
```env
DATABASE_URL=$POSTGRES_PRISMA_URL  # Auto-set by Vercel Postgres
AUTH_SECRET="production-secret"    # Generate with: openssl rand -base64 32
NODE_ENV=production
```

## Environment Detection

The app automatically detects environment:

```typescript
// config/environmentManager.ts
export function getEnvironment(): Environment {
  if (process.env.VERCEL) return 'prod'
  const nodeEnv = process.env.NODE_ENV || 'development'
  if (nodeEnv === 'production') return 'prod'
  return 'local'
}
```

## File Structure

```
apisandbox/
├── config/
│   ├── environmentManager.ts          # Environment detection & config
│   └── environments/
│       ├── local.env.example          # Local development template
│       └── prod.env.example           # Production (Vercel) template
├── docker-compose.yml                 # Local PostgreSQL
├── prisma/
│   └── schema.prisma                  # PostgreSQL schema (all environments)
├── .env.local                         # Local environment (gitignored)
└── vercel.json                        # Vercel configuration
```

## Local Setup Options

### Option 1: Docker PostgreSQL (Recommended)

```bash
npm run db:up          # Start PostgreSQL container
npm run db:migrate     # Run migrations
npm run dev           # Start app
```

### Option 2: Local PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql@15

# Create database
createdb apisandbox_dev

# Update .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/apisandbox_dev"
```

## Environment Variables

### Required

- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - NextAuth secret (32+ characters)

### Optional

- `GOOGLE_CLIENT_ID` - OAuth (if using)
- `GOOGLE_CLIENT_SECRET` - OAuth (if using)
- `NEXT_PUBLIC_APP_URL` - Application URL (auto-set in Vercel)

## Migration Flow

### Local → Production

1. **Develop locally** with Docker PostgreSQL
2. **Test migrations** locally: `npm run db:migrate`
3. **Deploy to Vercel** (same schema)
4. **Run migrations** in production: `npx prisma migrate deploy`

No schema changes needed!

## Benefits Over Multi-Environment

| Traditional Approach | Mono-Environment |
|---------------------|------------------|
| Different DB per env | Same PostgreSQL everywhere |
| Code changes per env | Only env vars change |
| Complex setup | Simple setup |
| Deployment issues | Smooth deployments |

## Quick Commands

```bash
# Database
npm run db:up              # Start PostgreSQL (Docker)
npm run db:down            # Stop PostgreSQL
npm run db:migrate         # Run migrations (dev)
npm run db:migrate:deploy  # Run migrations (prod)
npm run db:studio          # Open Prisma Studio

# Environment
npm run env:local          # Copy local env template
npm run env:prod           # Show prod env template

# Development
npm run dev                # Start dev server
npm run build              # Build for production
```

## Troubleshooting

### "Database connection failed"

**Local:**
- Ensure Docker is running: `docker ps`
- Check PostgreSQL is up: `npm run db:logs`
- Verify `DATABASE_URL` in `.env.local`

**Production:**
- Check `DATABASE_URL=$POSTGRES_PRISMA_URL` in Vercel
- Verify Vercel Postgres is active
- Run migrations: `npx prisma migrate deploy`

### "Prisma Client not generated"

```bash
npm run db:generate
# Or
npx prisma generate
```

## Next Steps

1. **Local Setup**: `npm run db:up && npm run env:local`
2. **Test Locally**: `npm run dev`
3. **Deploy to Vercel**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
