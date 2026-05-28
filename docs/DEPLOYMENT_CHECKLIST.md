# Vercel Deployment Checklist

Step-by-step checklist for deploying to Vercel. Use this to ensure nothing is missed.

## ✅ Pre-Deployment

### Code Preparation
- [ ] Code is committed to Git
- [ ] All changes pushed to repository
- [ ] Build succeeds locally: `npm run build`
- [ ] Tests pass (if applicable): `npm test`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Prisma schema uses PostgreSQL: `provider = "postgresql"` in `prisma/schema.prisma`

### Security Check
- [ ] No secrets in code (checked with `git grep` for API keys)
- [ ] `.env` and `.env.local` files are in `.gitignore`
- [ ] Example files use placeholders only (`CHANGE_ME`, `your-`, etc.)
- [ ] No hardcoded credentials in source code

---

## 🚀 Vercel Setup

### Project Import
- [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Click **"Add New Project"**
- [ ] Import Git repository
- [ ] Framework auto-detected as **Next.js**
- [ ] Root directory is correct (if monorepo)

### Database Setup
- [ ] Go to **Storage** tab in Vercel Dashboard
- [ ] Click **"Create Database"** → **Postgres**
- [ ] Database name: `apisandbox-db` (or your choice)
- [ ] Region selected (closest to users)
- [ ] Database created successfully
- [ ] Vercel auto-generated: `POSTGRES_PRISMA_URL`, `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`

### Environment Variables

**Required Variables** (Settings → Environment Variables):

- [ ] `DATABASE_URL` = `$POSTGRES_PRISMA_URL` (references Vercel's variable)
- [ ] `AUTH_SECRET` = `[32+ character secret]` (generated with `openssl rand -base64 32`)
- [ ] `NEXTAUTH_SECRET` = `[same as AUTH_SECRET]`
- [ ] `NODE_ENV` = `production`

**Optional Variables** (if using OAuth):

- [ ] `GOOGLE_CLIENT_ID` = `[from Google Cloud Console]`
- [ ] `GOOGLE_CLIENT_SECRET` = `[from Google Cloud Console]`
- [ ] `NEXT_PUBLIC_APP_URL` = `https://your-app.vercel.app`

**Environment Scope**:
- [ ] Variables applied to **Production** environment
- [ ] Variables applied to **Preview** (optional, for PR previews)
- [ ] Variables applied to **Development** (optional, for Vercel CLI)

**📖 See [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md) for complete reference**  
**📖 See [PRODUCTION_CONFIG_SYNC.md](./PRODUCTION_CONFIG_SYNC.md) for prod/preview sync, health checks, and config changelog**

---

## 🚢 Deployment

### Initial Deployment
- [ ] Click **"Deploy"** in Vercel Dashboard
- [ ] Build completes successfully
- [ ] Deployment URL accessible (e.g., `https://apisandbox.vercel.app`)
- [ ] No build errors in Vercel logs

### Database Migration
- [ ] Install Vercel CLI: `npm i -g vercel` (if not installed)
- [ ] Pull environment: `vercel env pull .env.local`
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Verify migrations succeeded
- [ ] Database tables created (check with `npx prisma studio` or Vercel Dashboard)

---

## 🧪 Post-Deployment Testing

### Basic Functionality
- [ ] Homepage loads correctly
- [ ] No console errors in browser
- [ ] No 500 errors in Vercel logs
- [ ] Static pages render correctly

### Authentication
- [ ] Sign up page accessible
- [ ] Can create new account
- [ ] Can log in with email/password
- [ ] Session persists after page refresh
- [ ] Logout works correctly
- [ ] Protected routes redirect to login when not authenticated

### OAuth (if configured)
- [ ] Google OAuth button visible (if `GOOGLE_CLIENT_ID` set)
- [ ] Google OAuth redirects to Google
- [ ] Google OAuth callback works
- [ ] User can sign in with Google
- [ ] OAuth callback URL matches: `https://your-app.vercel.app/api/auth/callback/google`

### Database
- [ ] User data persists after signup
- [ ] Can query database (test with a simple query)
- [ ] Database connection stable (no connection errors in logs)

---

## 🔒 Security Verification

- [ ] HTTPS enabled (automatic on Vercel, verify URL starts with `https://`)
- [ ] Database uses SSL (automatic with Vercel Postgres)
- [ ] `AUTH_SECRET` is strong (32+ characters, randomly generated)
- [ ] No secrets visible in Vercel build logs
- [ ] Environment variables not exposed in client-side code
- [ ] `.env` files not committed to Git

---

## 📊 Monitoring & Optimization

### Performance
- [ ] Page load times acceptable (< 3s for first load)
- [ ] No large bundle warnings in build logs
- [ ] Images optimized (if applicable)
- [ ] API routes respond quickly (< 500ms)

### Logs & Debugging
- [ ] Vercel logs accessible
- [ ] Error tracking set up (optional: Sentry, etc.)
- [ ] Database queries logged in development (not production)

---

## 🔄 Continuous Deployment

### Git Integration
- [ ] Automatic deployments enabled for main branch
- [ ] Preview deployments work for pull requests
- [ ] Deployment notifications configured (optional)

### Environment Sync
- [ ] Production environment variables documented
- [ ] Team members have access to Vercel project
- [ ] Deployment process documented for team

---

## 🐛 Troubleshooting

If deployment fails, check:

- [ ] Build logs in Vercel Dashboard
- [ ] Environment variables are set correctly
- [ ] Database is active and accessible
- [ ] Prisma migrations are up to date
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Dependencies installed: `npm install`

**Common Issues**:
- **Build fails**: Check `package.json` scripts, ensure `prisma generate` runs
- **Database error**: Verify `DATABASE_URL=$POSTGRES_PRISMA_URL` is set
- **Auth error**: Verify `AUTH_SECRET` is 32+ characters
- **OAuth fails**: Check callback URL matches in Google Cloud Console

---

## 📚 Quick Reference

- **Environment Variables**: [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md)
- **Deployment Guide**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Mono-Environment**: [MONO_ENVIRONMENT.md](./MONO_ENVIRONMENT.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## ✅ Final Checklist

Before marking deployment as complete:

- [ ] All required environment variables set
- [ ] Database migrations run successfully
- [ ] Authentication works (signup/login)
- [ ] Protected routes work correctly
- [ ] OAuth works (if configured)
- [ ] No errors in Vercel logs
- [ ] HTTPS enabled and working
- [ ] Team notified of deployment (if applicable)

**Deployment Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete | ⬜ Failed

**Deployment Date**: _______________

**Deployed By**: _______________

**Notes**: 
_________________________________________________
_________________________________________________
