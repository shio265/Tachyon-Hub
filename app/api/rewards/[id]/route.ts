import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000"
const AUTH_KEY = process.env.AUTH_KEY

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { success: false, error: "Forbidden. Only admin or manager can update rewards." },
        { status: 403 }
      )
    }

    const { id } = await params
    const formData = await request.formData()
    
    // Forward the form data to the backend API
    const response = await fetch(`${API_BASE_URL}/api/v1/rewards/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": AUTH_KEY || "",
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Failed to update reward" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating reward:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update reward" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { success: false, error: "Forbidden. Only admin or manager can delete rewards." },
        { status: 403 }
      )
    }

    const { id } = await params
    
    // Forward the delete request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/v1/rewards/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": AUTH_KEY || "",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Failed to delete reward" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error deleting reward:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete reward" },
      { status: 500 }
    )
  }
}
