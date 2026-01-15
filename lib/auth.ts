/**
 * Password Security Utilities
 * 
 * MENTOR NOTE: Password Security Best Practices
 * 
 * 1. NEVER store plain text passwords
 * 2. Use bcrypt (or Argon2) - industry standard
 * 3. Salt rounds: 10-12 (balance security vs performance)
 * 4. bcrypt automatically handles:
 *    - Unique salt per password
 *    - Cost factor (work factor)
 *    - One-way hashing (cannot reverse)
 * 
 * How it works:
 * - User signs up: password → bcrypt.hash() → stored hash
 * - User logs in: entered password → bcrypt.compare() → true/false
 * 
 * Security features:
 * - Same password = different hash (due to unique salt)
 * - Slow hashing (100-400ms) prevents brute force
 * - Rainbow table attacks impossible
 */

import bcrypt from 'bcryptjs'

// MENTOR NOTE: Salt rounds determine security vs performance
// - 10 rounds = ~100ms to hash (good balance)
// - 12 rounds = ~400ms to hash (more secure, slower)
// - Higher = more secure but slower user experience
const SALT_ROUNDS = 12

/**
 * Hash a password before storing in database
 * 
 * @param password - Plain text password (NEVER store this!)
 * @returns Hashed password with salt included
 * 
 * Example output: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY..."
 */
export async function hashPassword(password: string): Promise<string> {
  // bcrypt.hash() automatically:
  // 1. Generates a unique random salt
  // 2. Includes salt in the hash output
  // 3. Applies the cost factor (SALT_ROUNDS)
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a stored hash
 * 
 * @param password - Plain text password from user input
 * @param hash - Stored hash from database
 * @returns true if password matches, false otherwise
 * 
 * MENTOR NOTE: bcrypt.compare() extracts the salt from the hash
 * and compares the password. This is why we don't need to store
 * the salt separately.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  // bcrypt.compare() automatically:
  // 1. Extracts salt from the hash
  // 2. Hashes the input password with that salt
  // 3. Compares the two hashes
  return bcrypt.compare(password, hash)
}

/**
 * Validate password strength
 * 
 * MENTOR NOTE: Client-side validation is for UX,
 * but ALWAYS validate server-side too!
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  if (!/[@$!%*#?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*#?&)')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}


