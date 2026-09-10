import { createClient } from "@/lib/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Obtener configuración del sistema (regex, etc)
    const { data: config, error } = await supabase.from("app_config").select("value").eq("key", "yape_settings").single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ config: config.value })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
