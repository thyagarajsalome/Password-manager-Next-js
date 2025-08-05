import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex")

export function encrypt(text: string): { encrypted: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY)
  
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  
  const tag = cipher.getAuthTag()
  
  return {
    encrypted,
    iv: iv.toString("hex"),
    tag: tag.toString("hex")
  }
}

export function decrypt(encrypted: string, iv: string, tag: string): string {
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY)
  decipher.setAuthTag(Buffer.from(tag, "hex"))
  
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")
  
  return decrypted
}

export function generateMasterKey(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function validatePasswordStrength(password: string): {
  score: number
  feedback: string[]
  isStrong: boolean
} {
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length >= 12) score += 25
  else if (password.length >= 8) score += 15
  else feedback.push("Use at least 8 characters")

  // Character variety
  if (/[a-z]/.test(password)) score += 15
  else feedback.push("Include lowercase letters")

  if (/[A-Z]/.test(password)) score += 15
  else feedback.push("Include uppercase letters")

  if (/[0-9]/.test(password)) score += 15
  else feedback.push("Include numbers")

  if (/[^a-zA-Z0-9]/.test(password)) score += 20
  else feedback.push("Include special characters")

  // Common patterns
  if (/(.)\1{2,}/.test(password)) {
    score -= 10
    feedback.push("Avoid repeated characters")
  }

  if (/(123|abc|qwerty)/i.test(password)) {
    score -= 10
    feedback.push("Avoid common sequences")
  }

  // Common passwords
  const commonPasswords = [
    "password", "123456", "qwerty", "admin", "letmein",
    "welcome", "monkey", "dragon", "baseball", "football"
  ]
  
  if (commonPasswords.includes(password.toLowerCase())) {
    score -= 20
    feedback.push("Avoid common passwords")
  }

  return {
    score: Math.max(0, score),
    feedback,
    isStrong: score >= 70
  }
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
}

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex")
}

export function isSuspiciousActivity(activity: {
  ipAddress: string
  userAgent: string
  timestamp: number
  previousActivities?: Array<{ ipAddress: string; timestamp: number }>
}): boolean {
  const { ipAddress, userAgent, timestamp, previousActivities = [] } = activity
  
  // Check for rapid successive requests
  const recentActivities = previousActivities.filter(
    act => timestamp - act.timestamp < 5000 // 5 seconds
  )
  
  if (recentActivities.length > 10) {
    return true
  }
  
  // Check for IP changes in short period
  const ipChanges = previousActivities.filter(
    act => act.ipAddress !== ipAddress && timestamp - act.timestamp < 3600000 // 1 hour
  )
  
  if (ipChanges.length > 3) {
    return true
  }
  
  return false
}