import { updateSession } from "@/lib/proxy"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  // Only protected pages need a server-side session refresh. Keeping the
  // public landing and API routes out prevents every visitor/bot request from
  // becoming an additional Supabase Auth request.
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
