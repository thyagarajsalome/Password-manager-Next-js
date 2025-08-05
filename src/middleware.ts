import { NextRequest, NextResponse } from "next/server"
import { isSuspiciousActivity } from "@/lib/security"

export function middleware(request: NextRequest) {
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    
    // Check for suspicious activity
    const suspicious = isSuspiciousActivity({
      ipAddress: clientIP,
      userAgent,
      timestamp: Date.now()
    })
    
    if (suspicious) {
      return NextResponse.json(
        { error: "Suspicious activity detected" },
        { status: 429 }
      )
    }
    
    // Add security headers
    const response = NextResponse.next()
    
    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-XSS-Protection", "1; mode=block")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://checkout.razorpay.com;"
    )
    
    return response
  }
  
  // Protect auth routes
  if (request.nextUrl.pathname.startsWith("/auth/")) {
    const token = request.cookies.get("next-auth.session-token")
    
    if (token && (request.nextUrl.pathname === "/auth/signin" || request.nextUrl.pathname === "/auth/signup")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("next-auth.session-token")
    
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/:path*",
    "/auth/:path*",
    "/dashboard/:path*"
  ]
}