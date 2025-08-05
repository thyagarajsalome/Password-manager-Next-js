"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Shield, 
  Key, 
  Crown, 
  Zap, 
  Lock, 
  Star,
  Users,
  Database,
  Smartphone
} from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session && status === "authenticated") {
      router.push("/dashboard")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (session) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl mr-2">🔐</div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">SecureVault</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🔐</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            SecureVault Password Manager
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Manage your passwords securely with our emoji-enhanced interface. 
            Generate strong passwords, store them safely, and access them anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose SecureVault?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to keep your digital life secure and organized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl mb-4">🔒</div>
                <CardTitle className="flex items-center justify-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Military-Grade Security
                </CardTitle>
                <CardDescription>
                  Your passwords are encrypted with industry-standard AES-256 encryption
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl mb-4">🎨</div>
                <CardTitle className="flex items-center justify-center">
                  <Star className="mr-2 h-5 w-5" />
                  Emoji-Enhanced UI
                </CardTitle>
                <CardDescription>
                  Beautiful, intuitive interface with emojis for easy organization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl mb-4">⚡</div>
                <CardTitle className="flex items-center justify-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Password Generator
                </CardTitle>
                <CardDescription>
                  Create strong, unique passwords with customizable options
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl mb-4">📱</div>
                <CardTitle className="flex items-center justify-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Cross-Platform Sync
                </CardTitle>
                <CardDescription>
                  Access your passwords on all your devices seamlessly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl mb-4">👥</div>
                <CardTitle className="flex items-center justify-center">
                  <Users className="mr-2 h-5 w-5" />
                  Secure Sharing
                </CardTitle>
                <CardDescription>
                  Share passwords securely with family and team members
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl mb-4">💾</div>
                <CardTitle className="flex items-center justify-center">
                  <Database className="mr-2 h-5 w-5" />
                  Unlimited Storage
                </CardTitle>
                <CardDescription>
                  Store unlimited passwords with our premium plan
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Start free and upgrade when you need more features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center">
                  <Key className="mr-2 h-5 w-5" />
                  Free Plan
                </CardTitle>
                <div className="text-3xl font-bold">₹0<span className="text-lg font-normal">/month</span></div>
                <CardDescription>Perfect for personal use</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Up to 20 passwords</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Password generator</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Basic categories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Mobile app access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Email support</span>
                </div>
                <Link href="/auth/signup">
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative border-2 border-yellow-400">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-500 text-white">
                  <Crown className="mr-1 h-3 w-3" />
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center">
                  <Crown className="mr-2 h-5 w-5 text-yellow-500" />
                  Premium Plan
                </CardTitle>
                <div className="text-3xl font-bold">₹99<span className="text-lg font-normal">/month</span></div>
                <CardDescription>For power users and professionals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Unlimited passwords</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Advanced password generator</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Custom categories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Advanced security features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Password sharing</span>
                </div>
                <Link href="/auth/signup">
                  <Button className="w-full">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="text-2xl mr-2">🔐</div>
            <span className="text-lg font-semibold">SecureVault</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 SecureVault. All rights reserved. | Built with ❤️ in India
          </p>
        </div>
      </footer>
    </div>
  )
}