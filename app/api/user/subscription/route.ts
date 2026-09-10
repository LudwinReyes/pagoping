import { NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/api-auth"

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { data: subscription, error } = await auth.supabase
      .from("subscriptions")
      .select("user_id,email,tier,starts_at,ends_at,validations_count,max_validations,max_devices,can_export,is_active,created_at,business_name,owner_name,display_name,phone_number")
      .eq("user_id", auth.user.id)
      .maybeSingle()

    if (error) throw error

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("[v0] API - Error getting subscription:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
