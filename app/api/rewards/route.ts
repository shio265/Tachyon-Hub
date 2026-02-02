import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000"
const DEFAULT_API_KEY = process.env.DEFAULT_API_KEY || ""
const AUTH_KEY = process.env.AUTH_KEY

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/rewards`, {
      headers: {
        "x-api-key": DEFAULT_API_KEY,
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching rewards:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch rewards" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is admin or manager
    if (session.user.type !== "admin" && session.user.type !== "manager") {
      return NextResponse.json(
        { success: false, error: "Forbidden. Only admin or manager can create rewards." },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    
    // Forward the form data to the backend API
    const response = await fetch(`${API_BASE_URL}/api/v1/rewards`, {
      method: "POST",
      headers: {
        "Authorization": AUTH_KEY || "",
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Failed to create reward" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating reward:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create reward" },
      { status: 500 }
    )
  }
}
