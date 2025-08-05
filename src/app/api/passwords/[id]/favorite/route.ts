import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const password = await db.password.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!password) {
      return NextResponse.json({ error: "Password not found" }, { status: 404 })
    }

    const updatedPassword = await db.password.update({
      where: {
        id: params.id
      },
      data: {
        isFavorite: !password.isFavorite
      }
    })

    return NextResponse.json(updatedPassword)
  } catch (error) {
    console.error("Error updating password favorite status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}