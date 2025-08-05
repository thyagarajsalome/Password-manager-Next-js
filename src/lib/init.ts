import { db } from "@/lib/db"

export async function initializeDefaultCategories() {
  const defaultCategories = [
    { name: "General", icon: "🔐", description: "General passwords and logins" },
    { name: "Social", icon: "👥", description: "Social media accounts" },
    { name: "Work", icon: "💼", description: "Work-related accounts" },
    { name: "Finance", icon: "💰", description: "Banking and financial accounts" },
    { name: "Shopping", icon: "🛍️", description: "E-commerce and shopping sites" },
    { name: "Entertainment", icon: "🎬", description: "Streaming and entertainment services" },
    { name: "Technology", icon: "💻", description: "Tech and development accounts" },
    { name: "Education", icon: "📚", description: "Learning and educational platforms" },
    { name: "Health", icon: "🏥", description: "Health and medical accounts" },
    { name: "Travel", icon: "✈️", description: "Travel and booking sites" }
  ]

  try {
    for (const category of defaultCategories) {
      await db.passwordCategory.upsert({
        where: { name: category.name },
        update: {},
        create: category
      })
    }
    console.log("Default categories initialized successfully")
  } catch (error) {
    console.error("Error initializing default categories:", error)
  }
}