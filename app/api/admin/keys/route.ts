import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000"
const AUTH_KEY = process.env.AUTH_KEY

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log("Create API Key - Session:", session?.user)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please sign in" },
        { status: 401 }
      )
    }

    if (!AUTH_KEY) {
      console.error("AUTH_KEY is missing")
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      )
    }

    const body = await request.json()
    
    const requestBody = {
      name: body.name || session.user.name || "User API Key",
      discord_uid: session.user.id,
      description: body.description || "Auto-generated API key",
    }
    
    console.log("Creating API key with body:", requestBody)

    const response = await fetch(`${API_BASE_URL}/api/v1/admin/keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTH_KEY,
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error("API Error:", response.status, data)
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    console.error("Create API Key Error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create API key" },
      { status: 500 }
    )
  }
}
