# Troubleshooting Guide

## Module Resolution Errors

If you're seeing "Cannot find module" errors, follow these steps:

### 1. Install Dependencies

```bash
npm install
```

This installs all dependencies including newly added ones like `mermaid`.

### 2. Install Type Definitions (if needed)

```bash
npm install --save-dev @types/mermaid
```

### 3. Restart TypeScript Server (VS Code/Cursor)

- **VS Code/Cursor**: Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
- Type: `TypeScript: Restart TS Server`
- Press Enter

### 4. Clear Next.js Cache

```bash
rm -rf .next
npm run dev
```

### 5. Clear Node Modules (if issues persist)

```bash
rm -rf node_modules package-lock.json
npm install
```

### 6. Verify TypeScript Configuration

Check that `tsconfig.json` has correct paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 7. Check Import Paths

Ensure imports use the correct path aliases:

```typescript
// ✅ Correct
import { prisma } from "@/lib/prisma"
import Navigation from "@/components/Navigation"

// ❌ Incorrect
import { prisma } from "../lib/prisma"
```

## Common Module Errors

### Error: Cannot find module 'mermaid'

**Solution:**
```bash
npm install mermaid
npm install --save-dev @types/mermaid
```

### Error: Cannot find module '@/lib/...'

**Solution:**
- Verify `tsconfig.json` has `"@/*": ["./*"]` in paths
- Restart TypeScript server
- Ensure file exists at the path

### Error: Module not found: Can't resolve '...'

**Solution:**
1. Check if package is in `package.json`
2. Run `npm install`
3. Check if package name is correct
4. For Next.js, ensure package is compatible with server-side rendering

## Build Errors

### Error during `npm run build`

1. **Check TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

2. **Check for missing dependencies:**
   ```bash
   npm install
   ```

3. **Clear cache and rebuild:**
   ```bash
   rm -rf .next
   npm run build
   ```

## Development Server Issues

### Port already in use

```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or use different port
npm run dev -- -p 3000
```

### Hot reload not working

1. Clear `.next` folder
2. Restart dev server
3. Check for syntax errors in files

## Database Connection Issues

### Prisma Client not generated

```bash
cd apps/backend  # if in monorepo
npx prisma generate
```

### Database connection error

1. Check `DATABASE_URL` in `.env` or `.env.local`
2. Ensure database is running
3. Run migrations: `npx prisma migrate dev`

## Still Having Issues?

1. **Check the build output:**
   ```bash
   npm run build
   ```

2. **Check for linting errors:**
   ```bash
   npm run lint
   ```

3. **Verify Node.js version:**
   ```bash
   node --version  # Should be 18+
   ```

4. **Check package.json dependencies:**
   - Ensure all required packages are listed
   - Check for version conflicts
