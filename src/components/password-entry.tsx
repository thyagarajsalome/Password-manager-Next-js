"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Key, Globe, Mail, FileText, Star } from "lucide-react"

interface PasswordEntryProps {
  onSave: () => void
}

const categoryOptions = [
  { value: "general", label: "General", icon: "🔐" },
  { value: "social", label: "Social", icon: "👥" },
  { value: "work", label: "Work", icon: "💼" },
  { value: "finance", label: "Finance", icon: "💰" },
  { value: "shopping", label: "Shopping", icon: "🛍️" },
  { value: "entertainment", label: "Entertainment", icon: "🎬" },
  { value: "technology", label: "Technology", icon: "💻" },
  { value: "education", label: "Education", icon: "📚" },
  { value: "health", label: "Health", icon: "🏥" },
  { value: "travel", label: "Travel", icon: "✈️" }
]

const iconOptions = [
  "🔐", "👥", "💼", "💰", "🛍️", "🎬", "💻", "📚", "🏥", "✈️",
  "🔑", "🌐", "📧", "📝", "⭐", "🎮", "📱", "💳", "🏦", "🛒",
  "🎵", "📺", "🎬", "📷", "🎨", "🏠", "🚗", "✈️", "🏥", "💊"
]

export function PasswordEntry({ onSave }: PasswordEntryProps) {
  const [formData, setFormData] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
    category: "general",
    icon: "🔐",
    isFavorite: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/passwords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({
          title: "",
          username: "",
          password: "",
          url: "",
          notes: "",
          category: "general",
          icon: "🔐",
          isFavorite: false
        })
        onSave()
      } else {
        console.error("Failed to save password")
      }
    } catch (error) {
      console.error("Error saving password:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="title"
            placeholder="Enter password title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username/Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="username"
            placeholder="Enter username or email"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="url"
            placeholder="https://example.com"
            value={formData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Select value={formData.icon} onValueChange={(value) => handleInputChange("icon", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((icon) => (
                <SelectItem key={icon} value={icon}>
                  <span className="mr-2">{icon}</span>
                  {icon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Textarea
            id="notes"
            placeholder="Add any additional notes..."
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            className="pl-10 min-h-[80px]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isFavorite"
          checked={formData.isFavorite}
          onChange={(e) => handleInputChange("isFavorite", e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="isFavorite" className="flex items-center space-x-1">
          <Star className="h-4 w-4" />
          <span>Add to favorites</span>
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || !formData.title || !formData.password}>
        {isSubmitting ? "Saving..." : "Save Password"}
      </Button>
    </form>
  )
}