import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const payload = JSON.parse(atob(token.split(".")[1]))
    const userId = payload.sub

    const { deviceId } = await request.json()

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

    // Verificar que el dispositivo pertenece al usuario
    const { data: device } = await supabase
      .from("devices")
      .select("*")
      .eq("device_id", deviceId)
      .eq("user_id", userId)
      .maybeSingle()

    if (!device) {
      return NextResponse.json({ error: "Dispositivo no encontrado" }, { status: 404 })
    }

    // Eliminar dispositivo
    const { error } = await supabase.from("devices").delete().eq("device_id", deviceId).eq("user_id", userId)

    if (error) {
      return NextResponse.json({ error: "Error eliminando dispositivo" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
