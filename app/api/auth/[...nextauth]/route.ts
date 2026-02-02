import NextAuth, { AuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000"
const AUTH_KEY = process.env.AUTH_KEY || ""

interface DiscordProfile {
  id: string
  username: string
  discriminator: string
  avatar: string
}

async function ensureUploaderExists(discordId: string, name: string) {
  try {
    // Check if uploader exists
    const checkResponse = await fetch(
      `${API_BASE_URL}/api/v1/uploaders/discord/${discordId}`,
      {
        headers: {
          Authorization: AUTH_KEY,
        },
      }
    )

    if (checkResponse.ok) {
      // Uploader exists
      return
    }

    // Create new uploader
    await fetch(`${API_BASE_URL}/api/v1/uploaders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTH_KEY,
      },
      body: JSON.stringify({
        name: name,
        discord_uid: discordId,
        status: "active",
      }),
    })
  } catch (error) {
    console.error("Error ensuring uploader exists:", error)
  }
}

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const discordProfile = profile as DiscordProfile
        token.id = discordProfile.id
        // Ensure uploader exists when user logs in
        if (discordProfile.id && discordProfile.username) {
          await ensureUploaderExists(discordProfile.id, discordProfile.username)
        }
      }
      
      // Always fetch uploader info to get latest type
      if (token.id) {
        try {
          const uploaderResponse = await fetch(
            `${API_BASE_URL}/api/v1/uploaders/discord/${token.id}`,
            {
              headers: {
                Authorization: AUTH_KEY,
              },
            }
          )
          
          if (uploaderResponse.ok) {
            const uploaderData = await uploaderResponse.json()
            if (uploaderData.success && uploaderData.data) {
              token.uploaderId = uploaderData.data.id
              token.type = uploaderData.data.type || "default"
            }
          }
        } catch (error) {
          console.error("Error fetching uploader info:", error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.uploaderId = token.uploaderId as string | undefined
        session.user.type = token.type as "default" | "manager" | "admin" | undefined
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
