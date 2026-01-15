# Authentication Implementation Guide

## 🎓 Mentor-Level Overview

This document provides comprehensive guidance on the authentication system implemented in this application, following industry best practices similar to companies like Monzo.

## Architecture Overview

### Technology Stack

- **NextAuth.js v5 (Auth.js)**: Industry-standard authentication library for Next.js
- **Prisma**: Type-safe database ORM
- **SQLite**: Development database (easily switchable to PostgreSQL)
- **bcryptjs**: Password hashing (12 salt rounds)
- **Zod**: Runtime validation and type safety

### Authentication Methods

1. **Email/Password** (Credentials Provider)
   - Traditional authentication
   - Full control over user accounts
   - Password strength validation
   - Account lockout after failed attempts

2. **OAuth** (Google, GitHub)
   - Quick sign-up/sign-in
   - No password management
   - Trusted provider authentication

## Security Best Practices Implemented

### 1. Password Security

```typescript
// ✅ CORRECT: Hash passwords before storing
const passwordHash = await hashPassword(password)
await prisma.user.create({ data: { passwordHash } })

// ❌ WRONG: Never store plain text
await prisma.user.create({ data: { password: "plaintext" } })
```

**Key Points:**
- Passwords are hashed with bcrypt (12 salt rounds)
- Each password gets a unique salt automatically
- Same password = different hash (due to salt)
- One-way hashing (cannot reverse)
- Slow hashing (100-400ms) prevents brute force

### 2. Account Lockout

```typescript
// After 5 failed login attempts, lock account for 30 minutes
if (loginAttempts >= 5) {
  lockedUntil = new Date(Date.now() + 30 * 60 * 1000)
}
```

**Why it matters:**
- Prevents brute force attacks
- Protects user accounts
- Automatic unlock after timeout

### 3. Rate Limiting

```typescript
// Signup: 3 attempts per hour
// Login: 5 attempts per 15 minutes
// API: 100 requests per 15 minutes
```

**Implementation:**
- In-memory for development
- Redis recommended for production
- IP-based limiting

### 4. Input Validation

```typescript
// Always validate on server-side
const validatedData = signupSchema.parse(body)
```

**Why:**
- Client-side validation can be bypassed
- Server-side is the source of truth
- Prevents injection attacks

### 5. Session Management

```typescript
// JWT tokens with 30-day expiration
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

**Security Features:**
- HTTPS-only cookies in production
- HttpOnly cookies (prevents XSS)
- SameSite protection (prevents CSRF)
- Secure flag in production

## Database Schema

### User Model

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?   // bcrypt hash - NEVER plain text!
  loginAttempts Int       @default(0)
  lockedUntil   DateTime?
  isActive      Boolean   @default(true)
  // ... NextAuth required fields
}
```

**Key Fields:**
- `passwordHash`: Only stored if using email/password
- `loginAttempts`: Tracks failed attempts
- `lockedUntil`: Account lockout timestamp
- `isActive`: Account status

## Route Protection

### Middleware Configuration

```typescript
// middleware.ts
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/phase-*",
    "/observability/:path*",
  ],
}
```

**Protected Routes:**
- `/dashboard` - Main learning dashboard
- `/phase-1` through `/phase-4` - Learning phases
- `/observability` - Progress dashboard
- `/cloud` - Cloud migration section

**Public Routes:**
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/api/auth/*` - NextAuth endpoints

## Authentication Flow

### Signup Flow

1. User fills signup form
2. Client validates password strength (UX)
3. Server validates input (security)
4. Check if user exists
5. Hash password with bcrypt
6. Create user in database
7. Redirect to login

### Login Flow

1. User enters email/password
2. Find user in database
3. Check account status (active, locked)
4. Verify password with bcrypt.compare()
5. Reset login attempts on success
6. Create session (JWT token)
7. Redirect to dashboard

### OAuth Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. User authorizes
4. Google redirects back with code
5. NextAuth exchanges code for tokens
6. Creates/links account
7. Creates session
8. Redirects to dashboard

## Environment Variables

```env
# Required
DATABASE_URL="file:./dev.db"  # SQLite for dev, PostgreSQL for prod
AUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32

# Optional (for OAuth)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Production Checklist

- [ ] Change `AUTH_SECRET` to a secure random value
- [ ] Switch to PostgreSQL (or your production database)
- [ ] Set up Redis for rate limiting
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Set up email service (for password reset)
- [ ] Configure OAuth providers (Google, GitHub)
- [ ] Set up monitoring and logging
- [ ] Review and test security measures
- [ ] Set up backup strategy for database

## Common Security Mistakes to Avoid

### ❌ Don't Do This

```typescript
// Storing plain text passwords
password: "MyPassword123"

// Weak password hashing
passwordHash: md5(password)  // Too fast, vulnerable

// No rate limiting
// Anyone can spam your API

// Client-side only validation
// Can be bypassed

// Exposing user existence
if (!user) {
  return "User not found"  // Reveals if email exists
}
```

### ✅ Do This Instead

```typescript
// Hash passwords
passwordHash: await bcrypt.hash(password, 12)

// Rate limiting
const rateLimit = checkRateLimit(ip, "login")

// Server-side validation
const validated = schema.parse(input)

// Generic error messages
return "Invalid email or password"  // Doesn't reveal if user exists
```

## Testing Authentication

### Manual Testing

1. **Signup:**
   - Test password strength requirements
   - Test duplicate email handling
   - Test rate limiting

2. **Login:**
   - Test correct credentials
   - Test wrong password (check lockout)
   - Test locked account
   - Test OAuth flow

3. **Protected Routes:**
   - Access `/dashboard` without login (should redirect)
   - Access after login (should work)
   - Test session persistence

## Next Steps

1. **Email Verification:** Add email verification flow
2. **Password Reset:** Implement forgot password
3. **2FA/MFA:** Add two-factor authentication
4. **Subscription:** Integrate payment/subscription system
5. **Analytics:** Track authentication metrics

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcrypt Best Practices](https://github.com/kelektiv/node.bcrypt.js)


