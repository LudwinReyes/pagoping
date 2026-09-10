import { NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/api-auth"

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    const userId = auth.user.id

    const { deviceId } = await request.json()

    // Verificar que el dispositivo pertenece al usuario
    const { data: device } = await auth.supabase
      .from("devices")
      .select("device_id")
      .eq("device_id", deviceId)
      .eq("user_id", userId)
      .maybeSingle()

    if (!device) {
      return NextResponse.json({ error: "Dispositivo no encontrado" }, { status: 404 })
    }

    // Eliminar dispositivo
    const { error } = await auth.supabase.from("devices").delete().eq("device_id", deviceId).eq("user_id", userId)

    if (error) {
      return NextResponse.json({ error: "Error eliminando dispositivo" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
