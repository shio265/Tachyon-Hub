import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000"
const AUTH_KEY = process.env.AUTH_KEY || ""

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please sign in" },
        { status: 401 }
      )
    }

    // Only admin can update uploader status
    if (session.user.type !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/api/v1/uploaders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": AUTH_KEY,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error updating uploader status:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update uploader status" },
      { status: 500 }
    )
  }
}
