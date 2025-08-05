"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { loadRazorpay } from "@/lib/razorpay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, Shield, Zap, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  popular?: boolean
  icon: string
}

const plans: Plan[] = [
  {
    id: "premium",
    name: "Premium",
    price: 99,
    features: [
      "Unlimited passwords",
      "Advanced password generator",
      "Custom categories",
      "Priority support",
      "Advanced security features",
      "Password sharing"
    ],
    popular: true,
    icon: "👑"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    features: [
      "Everything in Premium",
      "Team management",
      "Advanced analytics",
      "SSO integration",
      "Dedicated account manager",
      "Custom integrations"
    ],
    icon: "🏢"
  }
]

export default function PaymentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>("premium")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const handlePayment = async (planId: string) => {
    if (!session) return

    setIsLoading(true)
    try {
      // Create order
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: planId }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const orderData = await response.json()

      // Load Razorpay
      const Razorpay = await loadRazorpay()

      if (!Razorpay) {
        throw new Error("Razorpay SDK failed to load")
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SecureVault",
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan Subscription`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          })

          if (verifyResponse.ok) {
            toast.success("Payment successful! Welcome to Premium! 🎉")
            router.push("/dashboard")
          } else {
            toast.error("Payment verification failed")
          }
        },
        prefill: {
          name: session.user.name || "",
          email: session.user.email || "",
        },
        theme: {
          color: "#3B82F6",
        },
      }

      const rzp = new Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Failed to initiate payment")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (session.user.isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="flex items-center justify-center">
              <Crown className="mr-2 h-5 w-5 text-yellow-500" />
              You're already Premium!
            </CardTitle>
            <CardDescription>
              You're already enjoying all the premium features of SecureVault.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Unlock all features and take your password security to the next level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-2 border-yellow-400' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-500 text-white">
                    <Crown className="mr-1 h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{plan.icon}</div>
                <CardTitle className="flex items-center justify-center">
                  {plan.name}
                  {plan.popular && <Crown className="ml-2 h-5 w-5 text-yellow-500" />}
                </CardTitle>
                <div className="text-3xl font-bold">
                  ₹{plan.price}
                  <span className="text-lg font-normal text-gray-500">/month</span>
                </div>
                <CardDescription>
                  Billed monthly • Cancel anytime
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className={`w-full ${plan.popular ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
                  onClick={() => handlePayment(plan.id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Subscribe to {plan.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Alert className="mb-8">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Secure Payment:</strong> All payments are processed securely through Razorpay, 
            India's leading payment gateway. Your payment information is never stored on our servers.
          </AlertDescription>
        </Alert>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Premium Features Include:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Unlimited password storage</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Advanced password generator</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Custom password categories</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Priority customer support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Advanced security analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Secure password sharing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}