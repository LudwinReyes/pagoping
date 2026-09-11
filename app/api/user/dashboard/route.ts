import { NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/api-auth"

const PAYMENT_COLUMNS = "id,user_id,device_id,sender_name,amount,operation_code,created_at"
const PAYMENT_SUMMARY_COLUMNS = "id,amount,created_at"
const DEVICE_COLUMNS = "device_id,user_id,device_name,last_seen,created_at,role,pairing_token,is_paired,is_active"

function startOfTodayInLima() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())

  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return new Date(`${value.year}-${value.month}-${value.day}T05:00:00.000Z`).toISOString()
}

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const userId = auth.user.id
    const todayStart = startOfTodayInLima()

    const [subscriptionResult, todayResult, recentResult, devicesResult, collaboratorsResult] = await Promise.all([
      auth.supabase
        .from("subscriptions")
        .select("user_id,email,tier,billing_period,starts_at,ends_at,validations_count,max_validations,max_devices,can_export,is_active,created_at,business_name,owner_name,display_name,phone_number")
        .eq("user_id", userId)
        .maybeSingle(),
      auth.supabase
        .from("payments")
        .select(PAYMENT_SUMMARY_COLUMNS)
        .eq("user_id", userId)
        .gte("created_at", todayStart)
        .order("created_at", { ascending: false }),
      auth.supabase
        .from("payments")
        .select(PAYMENT_COLUMNS)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(30),
      auth.supabase
        .from("devices")
        .select(DEVICE_COLUMNS)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
      auth.supabase
        .from("collaborators")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", userId),
    ])

    const error = subscriptionResult.error || todayResult.error || recentResult.error || devicesResult.error || collaboratorsResult.error
    if (error) {
      console.error("[dashboard] Error consultando Supabase:", error.message)
      return NextResponse.json({ error: "No se pudo cargar el panel" }, { status: 500 })
    }

    return NextResponse.json(
      {
        subscription: subscriptionResult.data,
        todayPayments: todayResult.data || [],
        recentPayments: recentResult.data || [],
        devices: devicesResult.data || [],
        collaboratorCount: collaboratorsResult.count || 0,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    )
  } catch (error) {
    console.error("[dashboard] Error inesperado:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
