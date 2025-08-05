import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, details, ipAddress, userAgent } = await request.json()

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    // Log security event
    await db.securityLog.create({
      data: {
        userId: session.user.id,
        action,
        details: details || {},
        ipAddress: ipAddress || request.ip || "unknown",
        userAgent: userAgent || request.headers.get("user-agent") || "unknown",
        timestamp: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging security event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const logs = await db.securityLog.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        timestamp: "desc"
      },
      take: limit,
      skip: offset
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching security logs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}