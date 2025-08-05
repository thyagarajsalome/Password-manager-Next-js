"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Key, 
  Copy, 
  RefreshCw, 
  Shield, 
  Zap, 
  Hash,
  AtSign,
  DollarSign
} from "lucide-react"
import { toast } from "sonner"

export function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState([16])
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  })
  const [strength, setStrength] = useState(0)

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    const similar = "il1Lo0O"
    const ambiguous = "{}[]()/\\'\"`~,;.<>"
    
    let charset = ""
    if (options.uppercase) charset += uppercase
    if (options.lowercase) charset += lowercase
    if (options.numbers) charset += numbers
    if (options.symbols) charset += symbols
    
    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !similar.includes(char)).join('')
    }
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !ambiguous.includes(char)).join('')
    }
    
    if (charset === "") {
      setPassword("Please select at least one option")
      return
    }
    
    let generatedPassword = ""
    for (let i = 0; i < length[0]; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    
    setPassword(generatedPassword)
    calculateStrength(generatedPassword)
  }

  const calculateStrength = (pwd: string) => {
    let score = 0
    const length = pwd.length
    
    // Length score
    if (length >= 8) score += 20
    if (length >= 12) score += 20
    if (length >= 16) score += 20
    
    // Character variety score
    if (/[a-z]/.test(pwd)) score += 10
    if (/[A-Z]/.test(pwd)) score += 10
    if (/[0-9]/.test(pwd)) score += 10
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 20
    
    setStrength(Math.min(score, 100))
  }

  const getStrengthColor = (score: number) => {
    if (score < 40) return "bg-red-500"
    if (score < 70) return "bg-yellow-500"
    if (score < 90) return "bg-green-500"
    return "bg-emerald-500"
  }

  const getStrengthText = (score: number) => {
    if (score < 40) return "Weak"
    if (score < 70) return "Fair"
    if (score < 90) return "Good"
    return "Excellent"
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    toast.success("Password copied to clipboard!")
  }

  useEffect(() => {
    generatePassword()
  }, [length, options])

  const toggleOption = (option: keyof typeof options) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Generated Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Generated Password</span>
          </CardTitle>
          <CardDescription>
            Your secure password is ready to use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                value={password}
                readOnly
                className="font-mono text-lg"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generatePassword}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Password Strength */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Password Strength</span>
                <Badge variant="outline" className={getStrengthColor(strength).replace('bg-', 'text-')}>
                  {getStrengthText(strength)}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
                  style={{ width: `${strength}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Password Options</span>
          </CardTitle>
          <CardDescription>
            Customize your password generation settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Length Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="length">Password Length</Label>
              <Badge variant="outline">{length[0]} characters</Badge>
            </div>
            <Slider
              id="length"
              min={8}
              max={32}
              step={1}
              value={length}
              onValueChange={setLength}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>8</span>
              <span>16</span>
              <span>24</span>
              <span>32</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Character Types</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="uppercase"
                  checked={options.uppercase}
                  onCheckedChange={() => toggleOption("uppercase")}
                />
                <Label htmlFor="uppercase" className="flex items-center space-x-1">
                  <span className="font-mono text-sm">ABC</span>
                  <span>Uppercase</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="lowercase"
                  checked={options.lowercase}
                  onCheckedChange={() => toggleOption("lowercase")}
                />
                <Label htmlFor="lowercase" className="flex items-center space-x-1">
                  <span className="font-mono text-sm">abc</span>
                  <span>Lowercase</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="numbers"
                  checked={options.numbers}
                  onCheckedChange={() => toggleOption("numbers")}
                />
                <Label htmlFor="numbers" className="flex items-center space-x-1">
                  <Hash className="h-4 w-4" />
                  <span>Numbers</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="symbols"
                  checked={options.symbols}
                  onCheckedChange={() => toggleOption("symbols")}
                />
                <Label htmlFor="symbols" className="flex items-center space-x-1">
                  <AtSign className="h-4 w-4" />
                  <span>Symbols</span>
                </Label>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Advanced Options</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="excludeSimilar"
                  checked={options.excludeSimilar}
                  onCheckedChange={() => toggleOption("excludeSimilar")}
                />
                <Label htmlFor="excludeSimilar" className="flex items-center space-x-1">
                  <Zap className="h-4 w-4" />
                  <span>Exclude similar characters (i, l, 1, L, o, 0, O)</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="excludeAmbiguous"
                  checked={options.excludeAmbiguous}
                  onCheckedChange={() => toggleOption("excludeAmbiguous")}
                />
                <Label htmlFor="excludeAmbiguous" className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Exclude ambiguous characters (braces, brackets, parentheses, slashes, quotes, backticks, tilde, semicolon, colon, dots, angle brackets)</span>
                </Label>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button onClick={generatePassword} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}