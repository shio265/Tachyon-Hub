import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
const DEFAULT_API_KEY = process.env.DEFAULT_API_KEY || ""

interface ApiCodeResponse {
  id: string
  uploader_id: string
  code: string
  expired_at: string | null
  created_at: string
  rewards: Array<{
    reward_id: string
    name: string
    icon: string
    amount: number
  }>
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Build query string
    const params = new URLSearchParams()
    if (searchParams.get("active")) {
      params.append("active", searchParams.get("active")!)
    }
    if (searchParams.get("reward")) {
      params.append("reward", searchParams.get("reward")!)
    }
    if (searchParams.get("version")) {
      params.append("version", searchParams.get("version")!)
    }

    const response = await fetch(
      `${NEXT_PUBLIC_API_URL}/api/v1/strinova/code?${params.toString()}`,
      {
        headers: {
          "x-api-key": DEFAULT_API_KEY,
          "User-Agent": "Tachyon-Hub/1.0",
        },
      }
    )

    const data = await response.json()
    
    // Enrich codes with uploader information
    if (data.success && data.data && Array.isArray(data.data)) {
      const enrichedCodes = await Promise.all(
        data.data.map(async (code: ApiCodeResponse) => {
          try {
            const uploaderResponse = await fetch(
              `${NEXT_PUBLIC_API_URL}/api/v1/uploaders/${code.uploader_id}`,
              {
                headers: {
                  "x-api-key": DEFAULT_API_KEY,
                  "User-Agent": "Tachyon-Hub/1.0",
                },
              }
            )
            
            if (uploaderResponse.ok) {
              const uploaderData = await uploaderResponse.json()
              if (uploaderData.success && uploaderData.data) {
                return {
                  ...code,
                  uploader_name: uploaderData.data.name,
                  uploader_discord_uid: uploaderData.data.discord_uid,
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching uploader ${code.uploader_id}:`, error)
          }
          return code
        })
      )
      
      return NextResponse.json({ ...data, data: enrichedCodes })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching codes:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch codes" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please sign in" },
        { status: 401 }
      )
    }

    const body = await request.json()

    const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v1/strinova/code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": DEFAULT_API_KEY,
        "User-Agent": "Tachyon-Hub/1.0",
      },
      body: JSON.stringify({
        discord_uid: session.user.id,
        ...body,
      }),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error creating code:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create code" },
      { status: 500 }
    )
  }
}
