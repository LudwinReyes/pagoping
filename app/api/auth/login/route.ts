import { createClient } from "@/lib/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const supabase = await createClient()

  console.log("[v0] API - Attempting login for:", email)

  const { error, data: authData } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.log("[v0] API - Login error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  console.log("[v0] API - Login successful")
  console.log("[v0] API - Session exists:", !!authData.session)

  return NextResponse.json(
    {
      success: true,
      user: authData.user,
      session: authData.session,
      accessToken: authData.session?.access_token,
      redirectTo: email === "ludwintac@gmail.com" ? "/admin" : "/dashboard",
    },
    { status: 200 },
  )
}
