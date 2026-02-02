import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Check if the request is for /codes and user is not authenticated
  if (request.nextUrl.pathname.startsWith("/codes") && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/codes/:path*"],
}
