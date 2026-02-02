import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      uploaderId?: string
      name?: string | null
      email?: string | null
      image?: string | null
      type?: "default" | "manager" | "admin"
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    uploaderId?: string
    type?: "default" | "manager" | "admin"
  }
}
