"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Search, 
  Star, 
  Lock, 
  Mail, 
  Globe, 
  CreditCard, 
  Settings, 
  LogOut,
  Crown,
  Shield,
  Key,
  Smartphone,
  Laptop,
  Gamepad2,
  ShoppingBag,
  Bank,
  MoreHorizontal,
  Copy,
  Eye,
  EyeOff
} from "lucide-react"
import { PasswordEntry } from "@/components/password-entry"
import { PasswordGenerator } from "@/components/password-generator"
import { toast } from "sonner"

interface Password {
  id: string
  title: string
  username?: string
  password: string
  url?: string
  category: string
  icon?: string
  isFavorite: boolean
  createdAt: string
}

const categoryIcons: Record<string, string> = {
  general: "🔐",
  social: "👥",
  work: "💼",
  finance: "💰",
  shopping: "🛍️",
  entertainment: "🎬",
  technology: "💻",
  education: "📚",
  health: "🏥",
  travel: "✈️"
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [passwords, setPasswords] = useState<Password[]>([])
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showPasswordId, setShowPasswordId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchPasswords()
    }
  }, [session])

  useEffect(() => {
    filterPasswords()
  }, [passwords, searchQuery, selectedCategory])

  const fetchPasswords = async () => {
    try {
      const response = await fetch("/api/passwords")
      if (response.ok) {
        const data = await response.json()
        setPasswords(data)
      }
    } catch (error) {
      console.error("Error fetching passwords:", error)
    }
  }

  const filterPasswords = () => {
    let filtered = passwords

    if (searchQuery) {
      filtered = filtered.filter(
        (password) =>
          password.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          password.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          password.url?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((password) => password.category === selectedCategory)
    }

    setFilteredPasswords(filtered)
  }

  const togglePasswordVisibility = (passwordId: string) => {
    setShowPasswordId(showPasswordId === passwordId ? null : passwordId)
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`)
  }

  const toggleFavorite = async (passwordId: string) => {
    try {
      const response = await fetch(`/api/passwords/${passwordId}/favorite`, {
        method: "PATCH"
      })
      
      if (response.ok) {
        setPasswords(passwords.map(p => 
          p.id === passwordId ? { ...p, isFavorite: !p.isFavorite } : p
        ))
        toast.success("Password updated!")
      }
    } catch (error) {
      toast.error("Failed to update password")
    }
  }

  const categories = [
    { id: "all", name: "All", icon: "📂" },
    { id: "general", name: "General", icon: "🔐" },
    { id: "social", name: "Social", icon: "👥" },
    { id: "work", name: "Work", icon: "💼" },
    { id: "finance", name: "Finance", icon: "💰" },
    { id: "shopping", name: "Shopping", icon: "🛍️" },
    { id: "entertainment", name: "Entertainment", icon: "🎬" },
    { id: "technology", name: "Technology", icon: "💻" }
  ]

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
              <div className="flex items-center space-x-2">
                {session.user.isPremium ? (
                  <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Free Plan
                  </Badge>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/api/auth/signout")}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {session.user.name}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your passwords are safe and secure with us.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Passwords</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{passwords.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {passwords.filter(p => p.isFavorite).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(passwords.map(p => p.category)).size}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Add New Password
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Password</DialogTitle>
                <DialogDescription>
                  Store a new password securely in your vault.
                </DialogDescription>
              </DialogHeader>
              <PasswordEntry onSave={fetchPasswords} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Key className="mr-2 h-4 w-4" />
                Generate Password
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Generate Strong Password</DialogTitle>
                <DialogDescription>
                  Create a secure password with customizable options.
                </DialogDescription>
              </DialogHeader>
              <PasswordGenerator />
            </DialogContent>
          </Dialog>

          {!session.user.isPremium && (
            <Button variant="outline" className="flex-1">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search passwords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              {categories.slice(0, 4).map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Category Tabs (Full) */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Passwords Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPasswords.map((password) => (
            <Card key={password.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {password.icon || categoryIcons[password.category] || "🔐"}
                    </span>
                    <div>
                      <CardTitle className="text-lg">{password.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {password.category.charAt(0).toUpperCase() + password.category.slice(1)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(password.id)}
                    >
                      <Star 
                        className={`h-4 w-4 ${password.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                      />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {password.username && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {password.username}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(password.username!, "Username")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-mono">
                      {showPasswordId === password.id ? password.password : "•".repeat(12)}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePasswordVisibility(password.id)}
                    >
                      {showPasswordId === password.id ? 
                        <EyeOff className="h-3 w-3" /> : 
                        <Eye className="h-3 w-3" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(password.password, "Password")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {password.url && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-blue-600 truncate">
                        {password.url}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(password.url, '_blank')}
                    >
                      <Globe className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPasswords.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No passwords found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || selectedCategory !== "all" 
                ? "Try adjusting your search or filters."
                : "Start by adding your first password to your secure vault."
              }
            </p>
            {(!searchQuery && selectedCategory === "all") && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Password</DialogTitle>
                    <DialogDescription>
                      Store a new password securely in your vault.
                    </DialogDescription>
                  </DialogHeader>
                  <PasswordEntry onSave={fetchPasswords} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </main>
    </div>
  )
}