import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const payload = JSON.parse(atob(token.split(".")[1]))
    const userEmail = payload.email
    const userId = payload.sub

    console.log("[v0] API - Subscription request for email:", userEmail, "userId:", userId)

    if (!userEmail && !userId) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    // Try to find subscription by user_id first, then by email
    let subscription = null
    let error = null

    // First try by email (most reliable since it's stored in the table)
    if (userEmail) {
      const result = await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("email", userEmail)
        .maybeSingle()

      subscription = result.data
      error = result.error
      console.log("[v0] API - Query by email result:", {
        email: userEmail,
        hasData: !!result.data,
        error: result.error?.message,
        errorCode: result.error?.code,
        status: result.status
      })
    }

    // If not found by email, try by user_id
    if (!subscription && userId) {
      const result = await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle()

      subscription = result.data
      error = result.error
      console.log("[v0] API - Query by user_id result:", {
        userId: userId,
        hasData: !!result.data,
        error: result.error?.message,
        errorCode: result.error?.code
      })
    }

    console.log("[v0] API - Final subscription:", subscription)

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("[v0] API - Error getting subscription:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
