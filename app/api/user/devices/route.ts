import { NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/api-auth"

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { data: devices, error } = await auth.supabase
      .from("devices")
      .select("device_id,user_id,device_name,last_seen,created_at,role,pairing_token,is_paired,is_active")
      .eq("user_id", auth.user.id)

    if (error) throw error

    return NextResponse.json({ devices: devices || [] })
  } catch (error) {
    console.error("[v0] API - Error getting devices:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
