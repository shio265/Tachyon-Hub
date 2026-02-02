import { NextResponse } from "next/server"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000"
const DEFAULT_API_KEY = process.env.DEFAULT_API_KEY || ""

export async function GET() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${API_BASE_URL}/`, {
      headers: {
        "x-api-key": DEFAULT_API_KEY,
        "User-Agent": "Tachyon-Hub/1.0",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "API is not responding" },
        { status: 503 }
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API health check failed:", error)
    return NextResponse.json(
      { success: false, error: "API is unavailable" },
      { status: 503 }
    )
  }
}
