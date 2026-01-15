# Session Error Fix

## Problem

The `/api/auth/session` endpoint was returning a 500 error with:
```
PrismaClientConstructorValidationError: Using engine type "client" requires either "adapter" or "accelerateUrl" to be provided to PrismaClient constructor.
```

## Root Cause

1. **Version Mismatch**: `package.json` had Prisma 7 (`^7.2.0`) but Prisma 6 (`6.19.1`) was installed
2. **Auth Export Issue**: The `auth` function was being exported from `auth-config.ts` which tried to create a NextAuth instance without the Prisma adapter
3. **Cached Build**: The `.next` directory had cached Prisma 7 client code

## Fixes Applied

### 1. Fixed Package.json Version Mismatch
```json
// Before
"@prisma/client": "^7.2.0",
"prisma": "^7.2.0"

// After
"@prisma/client": "^6.19.1",
"prisma": "^6.19.1"
```

### 2. Removed Auth Export from auth-config.ts
- Removed `export const { auth } = NextAuth(authConfig)` from `lib/auth-config.ts`
- This was trying to create a NextAuth instance without the Prisma adapter
- Added comment explaining to import from route handler instead

### 3. Export Auth from Route Handler
- Added `export const { auth } = handler` in `app/api/auth/[...nextauth]/route.ts`
- This ensures the auth instance has the Prisma adapter configured

### 4. Updated All Auth Imports
- Updated all files that import `auth` to use:
  ```typescript
  import { auth } from "@/app/api/auth/[...nextauth]/route"
  ```
- Files updated:
  - `app/api/subscription/check/route.ts`
  - `app/api/subscription/status/route.ts`
  - `app/api/subscription/upgrade/route.ts`

### 5. Cleared Cache and Regenerated
- Removed `.next` directory
- Regenerated Prisma Client
- Reinstalled dependencies

## Solution

**Restart the development server:**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

The session endpoint should now work correctly.

## Verification

After restarting, test the session endpoint:

```bash
curl http://localhost:4000/api/auth/session
```

Should return JSON (either `{}` if not logged in, or session data if logged in).

## Why This Happened

1. **Prisma 7 vs 6**: Prisma 7 requires an adapter/accelerateUrl, but we're using Prisma 6 which doesn't
2. **Module Loading Order**: Creating NextAuth instance in `auth-config.ts` at module load time tried to use Prisma before adapter was configured
3. **Build Cache**: Next.js cached the old Prisma 7 client code

## Prevention

- Keep `package.json` and installed versions in sync
- Only create NextAuth instance in route handler where adapter is available
- Clear `.next` cache when changing Prisma versions
- Always restart dev server after Prisma changes


