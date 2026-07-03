/**
 * Environment Configuration Manager
 * 
 * Mono-Environment Framework: Same code works locally and in cloud.
 * Just swap environment variables - no code changes needed.
 * 
 * Supports Vercel's deployment environments:
 * - local: Local development
 * - preview: Vercel preview deployments (PR branches)
 * - staging: Vercel custom environment (if configured)
 * - prod: Vercel production (main branch)
 */

export type Environment = 'local' | 'preview' | 'staging' | 'prod'

export interface AppConfig {
  database: {
    url: string
    provider: 'postgresql'
  }
  auth: {
    secret: string
    url?: string
  }
  app: {
    url: string
    port: number
    nodeEnv: string
  }
  oauth?: {
    google?: {
      clientId: string
      clientSecret: string
    }
  }
}

/**
 * Get configuration for current environment
 * Automatically detects environment from NODE_ENV and DATABASE_URL
 */
export function getConfig(): AppConfig {
  // Detect environment from NODE_ENV or DATABASE_URL
  const nodeEnv = process.env.NODE_ENV || 'development'
  const isProduction = nodeEnv === 'production'
  
  // Database URL - supports both local PostgreSQL and Vercel Postgres
  const databaseUrl = 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_PRISMA_URL || // Vercel Postgres
    process.env.POSTGRES_URL || // Vercel Postgres (alternative)
    'postgresql://postgres:postgres@localhost:5432/apisandbox_dev'

  // Auth secret - required for NextAuth
  const authSecret = 
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    (isProduction ? '' : 'dev-secret-change-in-production')

  if (isProduction && !authSecret) {
    console.warn('⚠️  AUTH_SECRET is required in production!')
  }

  // App URL - for OAuth callbacks and redirects
  let appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl && process.env.VERCEL_URL) {
    appUrl = `https://${process.env.VERCEL_URL}`
  }
  if (!appUrl) {
    appUrl = isProduction ? '' : 'http://localhost:4000'
  }

  // Port
  const port = Number.parseInt(process.env.PORT || '4000', 10)

  return {
    database: {
      url: databaseUrl,
      provider: 'postgresql',
    },
    auth: {
      secret: authSecret,
      url: appUrl ? `${appUrl}/api/auth` : undefined,
    },
    app: {
      url: appUrl || 'http://localhost:4000',
      port,
      nodeEnv,
    },
    oauth: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }
    } : undefined,
  }
}

/**
 * Validate environment configuration
 */
export function validateConfig(config: AppConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.database.url) {
    errors.push('DATABASE_URL is required')
  }

  if (!config.auth.secret) {
    errors.push('AUTH_SECRET is required')
  }

  if (config.auth.secret.length < 32) {
    errors.push('AUTH_SECRET must be at least 32 characters')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get current environment name
 * 
 * Detects environment using Vercel's environment variables:
 * - VERCEL_ENV: "production" | "preview" | "development"
 * - VERCEL_TARGET_ENV: Can be custom environment name (e.g. "staging")
 * - VERCEL: "1" when running on Vercel
 * 
 * Falls back to NODE_ENV for local development
 */
export function getEnvironment(): Environment {
  // On Vercel, use Vercel's environment detection
  if (process.env.VERCEL) {
    // Check for custom environment (staging, QA, etc.)
    const targetEnv = process.env.VERCEL_TARGET_ENV?.toLowerCase()
    if (targetEnv === 'staging') return 'staging'
    
    // Use VERCEL_ENV for standard environments
    const vercelEnv = process.env.VERCEL_ENV?.toLowerCase()
    if (vercelEnv === 'production') return 'prod'
    if (vercelEnv === 'preview') return 'preview'
    if (vercelEnv === 'development') return 'local'
    
    // Fallback: if VERCEL is set but VERCEL_ENV is not, assume production
    return 'prod'
  }
  
  // Local development - use NODE_ENV (staging = dev branch / staging containers)
  const nodeEnv = (process.env.NODE_ENV || 'development') as string
  if (nodeEnv === 'production') return 'prod'
  if (nodeEnv === 'staging') return 'staging'
  if (nodeEnv === 'development') return 'local'
  
  // Default to local
  return 'local'
}
