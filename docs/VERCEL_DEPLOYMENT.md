# Vercel Deployment Guide - Mono-Environment Framework

Complete guide for deploying to Vercel using PostgreSQL for all environments.

## 📋 Quick Overview

**Mono-Environment Framework**: Same code works locally and in production. Only `DATABASE_URL` changes.

- ✅ **Local**: PostgreSQL via Docker (`docker-compose up`)
- ✅ **Production**: Vercel Postgres (automatically configured)
- ✅ **Same Code**: No code changes between environments

## 🚀 Quick Deploy (5 Steps)

### 1. Update Prisma Schema

Already done! ✅ `prisma/schema.prisma` uses PostgreSQL:
```prisma
datasource db {
  provider = "postgresql"  // Works everywhere
  url      = env("DATABASE_URL")
}
```

### 2. Push to Git

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 3. Import to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your Git repository
4. Framework: **Next.js** (auto-detected)

### 4. Create Vercel Postgres Database

1. In Vercel Dashboard → Your Project
2. Go to **Storage** tab
3. Click **"Create Database"** → **Postgres**
4. Choose name: `apisandbox-db`
5. Select region
6. Click **"Create"**

Vercel automatically adds:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ← **Use this one**
- `POSTGRES_URL_NON_POOLING`

### 5. Set Environment Variables

**📖 See [Complete Environment Variables Reference](./VERCEL_ENV_VARIABLES.md) for full details.**

**Required variables** (in Vercel Dashboard → Settings → Environment Variables):

```env
# Database (references Vercel's auto-generated variable)
DATABASE_URL=$POSTGRES_PRISMA_URL

# NextAuth Secret (generate with: openssl rand -base64 32)
AUTH_SECRET="your-generated-secret-32-plus-characters"
NEXTAUTH_SECRET="same-as-auth-secret"

# Environment
NODE_ENV=production
```

**Optional (OAuth - Google):**
```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

**Apply to**: Production (and optionally Preview/Development)

### 6. Deploy

Click **"Deploy"** in Vercel Dashboard. After first deployment:

```bash
# Pull production environment
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

## 🏗️ Mono-Environment Setup

### Local Development

**Option 1: Docker PostgreSQL (Recommended)**

```bash
# Start PostgreSQL
npm run db:up

# Setup environment
npm run env:local
# Edit .env.local with your settings

# Run migrations
npm run db:migrate

# Start dev server
npm run dev
```

**Option 2: Local PostgreSQL**

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb apisandbox_dev

# Update .env.local
DATABASE_URL="postgresql://your-user:password@localhost:5432/apisandbox_dev"
```

### Production (Vercel)

1. Database: Vercel Postgres (automatic)
2. Environment variables: Set in Vercel Dashboard
3. Deploy: Automatic on git push

## 📁 Environment Files

```
config/
├── environmentManager.ts       # Environment detection logic
└── environments/
    ├── local.env.example       # Local development
    └── prod.env.example        # Production (Vercel)
```

## 🔧 Environment Configuration

The app automatically detects environment from:
- `NODE_ENV` (development/production)
- `VERCEL` (automatically set by Vercel)
- `DATABASE_URL` (connection string)

No code changes needed!

## 📝 Complete Checklist

### Pre-Deployment
- [x] Prisma schema uses PostgreSQL
- [ ] Code pushed to Git
- [ ] Build succeeds locally (`npm run build`)

### Vercel Setup
- [ ] Project imported from Git
- [ ] Vercel Postgres database created
- [ ] Environment variables set:
  - [ ] `DATABASE_URL=$POSTGRES_PRISMA_URL`
  - [ ] `AUTH_SECRET` (32+ characters)
  - [ ] `NODE_ENV=production`
- [ ] OAuth variables set (if using)

### Post-Deployment
- [ ] First deployment successful
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Test authentication (signup/login)
- [ ] Test protected routes
- [ ] Verify OAuth (if configured)

## 🗄️ Database Migration

After first deployment:

```bash
# Option 1: Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Option 2: Manual
# Copy POSTGRES_URL_NON_POOLING from Vercel Dashboard
DATABASE_URL="<copied-url>" npx prisma migrate deploy
```

## 🔐 Security Checklist

- [ ] `AUTH_SECRET` is strong (32+ characters)
- [ ] Generated with `openssl rand -base64 32`
- [ ] Not committed to Git
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Database uses SSL (automatic with Vercel Postgres)

## 🐛 Troubleshooting

### Build Fails: "Cannot find module '@prisma/client'"

**Solution:**
```bash
# Ensure postinstall script runs
npm install
```

### Database Connection Error

**Solution:**
- Verify `DATABASE_URL=$POSTGRES_PRISMA_URL` in Vercel
- Check Vercel Postgres is active
- Ensure migrations are run after deployment

### OAuth Not Working

**Solution:**
- Verify callback URL in OAuth provider:
  `https://your-app.vercel.app/api/auth/callback/google`
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set

## 📚 Related Documentation

- [Environment Variables Reference](./VERCEL_ENV_VARIABLES.md) - Complete list of all env vars
- [Architecture Documentation](./ARCHITECTURE.md)
- [Developer Setup](./DEV_SETUP.md)
- [Mono-Environment Framework](./MONO_ENVIRONMENT.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
