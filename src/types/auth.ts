import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isPremium: boolean
    } & DefaultSession["user"]
  }

  interface User {
    isPremium: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isPremium: boolean
  }
}