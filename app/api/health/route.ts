import { NextResponse } from "next/server"

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
const DEFAULT_API_KEY = process.env.DEFAULT_API_KEY || ""

export async function GET() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${NEXT_PUBLIC_API_URL}/`, {
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
