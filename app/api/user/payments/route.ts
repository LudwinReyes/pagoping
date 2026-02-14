import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.slice(7)

    // Decode JWT to get user email
    const parts = token.split(".")
    if (parts.length !== 3) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    let payload
    try {
      const decoded = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"))
      payload = decoded
    } catch {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const userEmail = payload.email
    const jwtUserId = payload.sub
    console.log("[v0] API - User payments - Email:", userEmail, "JWT User ID:", jwtUserId)

    if (!userEmail) {
      return NextResponse.json({ error: "Token incompleto" }, { status: 401 })
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // First, find the subscription to get the correct user_id
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("email", userEmail)
      .single()

    // Use the user_id from subscription if found, otherwise use JWT user_id
    const targetUserId = subscription?.user_id || jwtUserId
    console.log("[v0] API - Using user_id:", targetUserId, "(from subscription:", !!subscription?.user_id, ")")

    // Get today's date for filtering
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Fetch payments for this user_id
    const { data: allPayments, error: paymentsError } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", targetUserId)
      .order("created_at", { ascending: false })

    if (paymentsError) {
      console.error("[v0] API - Error fetching payments:", paymentsError)
      return NextResponse.json({ todayPayments: [], recentPayments: [] })
    }

    console.log("[v0] API - Total payments fetched for user:", allPayments?.length || 0)

    // Filter today's payments
    const todayPayments = (allPayments || []).filter((p: any) => new Date(p.created_at) >= today)
    const recentPayments = (allPayments || []).slice(0, 30)

    console.log("[v0] API - Today payments:", todayPayments.length, "Recent payments:", recentPayments.length)

    return NextResponse.json({
      todayPayments,
      recentPayments,
    })
  } catch (error) {
    console.error("[v0] API - Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
