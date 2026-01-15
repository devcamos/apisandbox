# Prisma Client Error Fix

## Problem

Error: `Using engine type "client" requires either "adapter" or "accelerateUrl" to be provided to PrismaClient constructor.`

## Root Cause

1. **Prisma 7 Config File**: `prisma.config.ts` is a Prisma 7 feature that Prisma 6 doesn't use
2. **Version Mismatch**: Having the config file caused Prisma to think it was Prisma 7
3. **Cached Client**: The Prisma client was generated with Prisma 7 settings

## Fix Applied

### 1. Removed `prisma.config.ts`
- This file is only for Prisma 7
- Prisma 6 reads everything from `schema.prisma`

### 2. Regenerated Prisma Client
```bash
rm -rf .next node_modules/.prisma
npx prisma generate
```

### 3. Updated package.json
- Set `@prisma/client` to `^6.19.1`
- Set `prisma` to `^6.19.1`

## Solution

**Restart the development server:**

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

The error should now be resolved.

## Verification

After restarting, test:
```bash
curl http://localhost:4000/api/auth/session
```

Should return JSON (not HTML error page).

## Why This Happened

- Prisma 7 introduced `prisma.config.ts` for configuration
- Prisma 6 doesn't use this file - it reads from `schema.prisma` directly
- Having both caused confusion and Prisma tried to use Prisma 7 features
- The Prisma client was generated expecting Prisma 7 behavior

## Prevention

- Use Prisma 6 OR Prisma 7, not a mix
- If using Prisma 6: Don't create `prisma.config.ts`
- If using Prisma 7: Use `prisma.config.ts` and provide adapter/accelerateUrl
- Always clear `.next` and `node_modules/.prisma` when changing Prisma versions


