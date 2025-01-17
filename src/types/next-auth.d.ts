import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    provider?: string
    isAdmin?: boolean
  }
  
  interface Session {
    user: {
      id: string
      provider?: string
      isAdmin?: boolean
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string
    isAdmin?: boolean
  }
}