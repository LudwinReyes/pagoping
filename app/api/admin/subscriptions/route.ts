import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    console.log("[v0] API - Authorization header:", !!authHeader)
    console.log("[v0] API - Token extracted:", !!token)

    if (!token) {
      console.log("[v0] API - No token provided")
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    let userEmail: string
    try {
      const parts = token.split(".")
      if (parts.length !== 3) {
        throw new Error("Invalid token format")
      }
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString())
      userEmail = payload.email
      console.log("[v0] API - User email from token:", userEmail)
    } catch (err) {
      console.log("[v0] API - Failed to decode token:", err)
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    // Verify user is admin
    if (userEmail !== "ludwintac@gmail.com") {
      console.log("[v0] API - User not admin:", userEmail)
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch { }
        },
      },
    })

    console.log("[v0] API - Fetching subscriptions from Supabase...")

    // Get search query parameter
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get("search")?.toLowerCase()

    let query = supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false })

    // Apply search filter if provided
    if (searchQuery && searchQuery.length >= 2) {
      console.log("[v0] API - Searching for:", searchQuery)
      query = query.or(`email.ilike.%${searchQuery}%,business_name.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%,owner_name.ilike.%${searchQuery}%`)
    }

    const { data: subscriptions, error: subsError } = await query

    if (subsError) {
      console.log("[v0] API - Subscriptions error:", subsError)
      throw subsError
    }

    console.log("[v0] API - Subscriptions found:", subscriptions?.length || 0)

    // Get payments count per user
    const { data: payments, error: paymentsError } = await supabase.from("payments").select("user_id")

    if (paymentsError) {
      console.log("[v0] API - Payments error:", paymentsError)
      throw paymentsError
    }

    const paymentsPerUser: Record<string, number> = {}
    payments?.forEach((p: any) => {
      paymentsPerUser[p.user_id] = (paymentsPerUser[p.user_id] || 0) + 1
    })

    const { data: devices, error: devicesError } = await supabase.from("devices").select("user_id, role")

    const devicesPerUser: Record<string, number> = {}
    devices?.forEach((d: any) => {
      devicesPerUser[d.user_id] = (devicesPerUser[d.user_id] || 0) + 1
    })

    // Add device count to each subscription
    const subscriptionsWithDevices = subscriptions?.map((sub) => ({
      ...sub,
      deviceCount: devicesPerUser[sub.user_id] || 0,
    }))

    console.log("[v0] API - Returning", subscriptions?.length || 0, "subscriptions")
    return NextResponse.json({
      subscriptions: subscriptionsWithDevices || [],
      paymentsPerUser,
    })
  } catch (error) {
    console.log("[v0] API - Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
