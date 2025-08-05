import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Razorpay from "razorpay"
import { db } from "@/lib/db"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan } = await request.json()
    
    if (!plan || !["premium", "enterprise"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const planPrices = {
      premium: 9900, // ₹99.00 in paise
      enterprise: 19900, // ₹199.00 in paise
    }

    const amount = planPrices[plan as keyof typeof planPrices]

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${session.user.id}_${Date.now()}`,
      notes: {
        userId: session.user.id,
        plan: plan,
      },
    }

    const order = await razorpay.orders.create(options)

    // Save order details to database
    await db.subscription.update({
      where: {
        userId: session.user.id
      },
      data: {
        plan: plan,
        amount: amount / 100, // Convert back to rupees
        currency: "INR",
        razorpayOrderId: order.id,
        status: "pending"
      }
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}