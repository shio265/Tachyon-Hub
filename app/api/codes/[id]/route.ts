import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000"
const DEFAULT_API_KEY = process.env.DEFAULT_API_KEY || ""

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

    const { id } = await params
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/api/v1/strinova/code/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": DEFAULT_API_KEY,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error updating code:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update code" },
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
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please sign in" },
        { status: 401 }
      )
    }

    const { id } = await params

    const response = await fetch(`${API_BASE_URL}/api/v1/strinova/code/${id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": DEFAULT_API_KEY,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error deleting code:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete code" },
      { status: 500 }
    )
  }
}
