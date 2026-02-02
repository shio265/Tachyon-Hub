import { Reward } from "@/lib/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export async function getCodesWithApiKey(apiKey: string, filters?: { active?: boolean; reward?: string }) {
  const params = new URLSearchParams()
  if (filters?.active !== undefined) params.set("active", String(filters.active))
  if (filters?.reward) params.set("reward", filters.reward)

  const url = `${API_BASE_URL}/api/v1/strinova/code${params.toString() ? `?${params}` : ""}`

  const response = await fetch(url, {
    headers: {
      "x-api-key": apiKey,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch codes")
  }

  return response.json()
}

export async function createCode(
  apiKey: string,
  data: {
    uploader_id: string
    code: string
    expired_at?: string
    rewards?: Reward[]
  }
) {
  const response = await fetch(`${API_BASE_URL}/api/v1/strinova/code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create code")
  }

  return response.json()
}

export async function getApiKeyByDiscordId(discordId: string, authToken: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/keys/discord/${discordId}`, {
    headers: {
      Authorization: authToken,
    },
  })

  if (!response.ok) {
    throw new Error("API key not found")
  }

  return response.json()
}
