import { createClient } from "@/lib/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener suscripción
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("user_id,email,tier,starts_at,ends_at,validations_count,max_validations,max_devices,can_export,is_active,created_at,business_name,owner_name,display_name,phone_number")
      .eq("user_id", user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Verificar si está activa
    const isExpired = subscription.ends_at && new Date(subscription.ends_at) < new Date()
    const isFreeLimitReached =
      subscription.tier === "free" && subscription.validations_count >= subscription.max_validations

    return NextResponse.json({
      subscription,
      isActive: !isExpired && !isFreeLimitReached,
      isExpired,
      isFreeLimitReached,
    })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
