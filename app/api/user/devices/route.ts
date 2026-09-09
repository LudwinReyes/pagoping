import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const payload = JSON.parse(atob(token.split(".")[1]))
    const userEmail = payload.email

    if (!userEmail) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    // Create client using service role key if available, or forwarding user token
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAdmin = serviceRoleKey
      ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey)
      : createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          }
        )

    // Get user ID from subscriptions
    const { data: authUser } = await supabaseAdmin
      .from("subscriptions")
      .select("user_id")
      .eq("email", userEmail)
      .maybeSingle()

    if (!authUser) {
      return NextResponse.json({ devices: [] })
    }

    // Get devices
    const { data: devices } = await supabaseAdmin.from("devices").select("*").eq("user_id", authUser.user_id)

    return NextResponse.json({ devices: devices || [] })
  } catch (error) {
    console.error("[v0] API - Error getting devices:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
