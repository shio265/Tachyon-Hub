import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Custom fetch wrapper with User-Agent
export async function fetchWithUserAgent(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers)
  headers.set("User-Agent", "Tachyon-Hub/1.0")
  
  return fetch(input, {
    ...init,
    headers,
  })
}
