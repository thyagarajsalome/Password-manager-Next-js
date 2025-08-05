import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { encrypt, validatePasswordStrength } from "@/lib/security"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const passwords = await db.password.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    // Note: In a real application, you would decrypt passwords here
    // For this demo, we'll return them as-is (but in production, always decrypt)
    return NextResponse.json(passwords)
  } catch (error) {
    console.error("Error fetching passwords:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, username, password, url, notes, category, icon, isFavorite } = await request.json()

    if (!title || !password) {
      return NextResponse.json(
        { error: "Title and password are required" },
        { status: 400 }
      )
    }

    // Validate password strength
    const strengthValidation = validatePasswordStrength(password)
    if (!strengthValidation.isStrong && !session.user.isPremium) {
      return NextResponse.json({
        error: "Password is not strong enough",
        feedback: strengthValidation.feedback
      }, { status: 400 })
    }

    // Check user's password limit for free tier
    if (!session.user.isPremium) {
      const existingPasswords = await db.password.count({
        where: {
          userId: session.user.id
        }
      })

      if (existingPasswords >= 20) {
        return NextResponse.json(
          { error: "Free tier limited to 20 passwords. Upgrade to premium for unlimited passwords." },
          { status: 403 }
        )
      }
    }

    // Encrypt the password
    const encrypted = encrypt(password)

    const newPassword = await db.password.create({
      data: {
        title,
        username,
        password: encrypted.encrypted,
        passwordIv: encrypted.iv,
        passwordTag: encrypted.tag,
        url,
        notes,
        category: category || "general",
        icon: icon || "🔐",
        isFavorite: isFavorite || false,
        userId: session.user.id
      }
    })

    return NextResponse.json(newPassword, { status: 201 })
  } catch (error) {
    console.error("Error creating password:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}