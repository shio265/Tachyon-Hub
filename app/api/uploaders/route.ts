import { NextRequest, NextResponse } from "next/server"

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
const AUTH_KEY = process.env.AUTH_KEY

export async function POST(request: NextRequest) {
  try {
    if (!AUTH_KEY) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      )
    }

    const body = await request.json()

    const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v1/uploaders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTH_KEY,
        "User-Agent": "Tachyon-Hub/1.0",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    if (!AUTH_KEY) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      )
    }

    const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v1/uploaders`, {
      headers: {
        Authorization: AUTH_KEY,
        "User-Agent": "Tachyon-Hub/1.0",
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
