import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { authenticateRequest } from "@/lib/api-auth"

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    const userId = auth.user.id

    // Verificar suscripción del usuario
    const { data: subscription } = await auth.supabase
      .from("subscriptions")
      .select("tier,max_devices")
      .eq("user_id", userId)
      .maybeSingle()

    const allowedTiers = ["business", "annual"]
    if (!subscription || !allowedTiers.includes(subscription.tier)) {
      return NextResponse.json({ error: "Solo disponible para plan Negocio o Anual" }, { status: 403 })
    }

    // Contar dispositivos actuales
    const { count } = await auth.supabase
      .from("devices")
      .select("device_id", { count: "exact", head: true })
      .eq("user_id", userId)

    if ((count || 0) >= subscription.max_devices) {
      return NextResponse.json(
        { error: `Límite de ${subscription.max_devices} dispositivos alcanzado` },
        { status: 400 },
      )
    }

    // Crear token único
    const pairingToken = uuidv4().substring(0, 8).toUpperCase()
    const deviceId = `staff_${uuidv4().substring(0, 12)}`

    // Crear dispositivo pendiente
    const { error } = await auth.supabase.from("devices").insert({
      device_id: deviceId,
      user_id: userId,
      device_name: "Empleado (Pendiente)",
      pairing_token: pairingToken,
      role: "viewer",
      is_paired: false,
    })

    if (error) {
      console.error("[v0] Error creating device:", error)
      return NextResponse.json({ error: "Error creando dispositivo" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      qrData: {
        userId,
        token: pairingToken,
        deviceId,
      },
      pairingToken,
    })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
