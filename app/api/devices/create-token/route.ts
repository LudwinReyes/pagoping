import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const payload = JSON.parse(atob(token.split(".")[1]))
    const userId = payload.sub
    const userEmail = payload.email

    // Create client using service role key if available, or forwarding user token
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabase = serviceRoleKey
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

    // Verificar suscripción del usuario
    const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle()

    const allowedTiers = ["business", "annual"]
    if (!subscription || !allowedTiers.includes(subscription.tier)) {
      return NextResponse.json({ error: "Solo disponible para plan Negocio o Anual" }, { status: 403 })
    }

    // Contar dispositivos actuales
    const { count } = await supabase.from("devices").select("*", { count: "exact", head: true }).eq("user_id", userId)

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
    const { error } = await supabase.from("devices").insert({
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
