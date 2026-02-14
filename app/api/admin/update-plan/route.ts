import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    console.log("[v0] API - Update plan - Token extracted: true")

    // Decode JWT to get admin email
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

    const adminEmail = payload.email
    console.log("[v0] API - Update plan - Admin email:", adminEmail)

    // Check if admin
    if (adminEmail !== "ludwintac@gmail.com") {
      console.log("[v0] API - Update plan - Not admin:", adminEmail)
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Get request body
    const body = await request.json()
    const { userId, tier, endDate, maxValidations, maxDevices, canExport } = body

    if (!userId || !tier) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    console.log("[v0] API - Update plan - User ID:", userId, "Tier:", tier)

    // Update subscription in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      console.error("[v0] API - Missing Supabase credentials")
      return NextResponse.json({ error: "Server error" }, { status: 500 })
    }

    const updateData: any = {
      tier,
      starts_at: new Date().toISOString(),
      max_validations: maxValidations,
      max_devices: maxDevices,
      can_export: canExport,
    }

    if (tier !== "free" && endDate) {
      updateData.ends_at = new Date(endDate).toISOString()
    } else if (tier === "free") {
      updateData.ends_at = null
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/subscriptions?user_id=eq.${userId}`, {
      method: "PATCH",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      console.error("[v0] API - Error updating plan:", response.statusText)
      return NextResponse.json({ error: "Error updating plan" }, { status: 500 })
    }

    console.log("[v0] API - Plan updated successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API - Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
