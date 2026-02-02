import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000"
const AUTH_KEY = process.env.AUTH_KEY

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ discordId: string }> }
) {
  try {
    if (!AUTH_KEY) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      )
    }

    const { discordId } = await params
    const response = await fetch(
      `${API_BASE_URL}/api/v1/uploaders/discord/${discordId}`,
      {
        headers: {
          Authorization: AUTH_KEY,
          "User-Agent": "Tachyon-Hub/1.0",
        },
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
