import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import crypto from "crypto"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = await request.json()

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 })
    }

    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex")

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Update subscription in database
    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        razorpayOrderId: razorpayOrderId
      }
    })

    if (!subscription) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update subscription with payment details
    await db.subscription.update({
      where: {
        id: subscription.id
      },
      data: {
        status: "active",
        razorpayPaymentId: razorpayPaymentId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    })

    // Update user's premium status
    await db.user.update({
      where: {
        id: session.user.id
      },
      data: {
        isPremium: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      plan: subscription.plan
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}