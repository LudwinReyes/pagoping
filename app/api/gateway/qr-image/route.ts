import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/api-auth"

export async function GET() {
  try {
    const supabase = createServiceRoleClient()

    // 1. Get current gateway config
    const { data: configRow } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "gateway_settings")
      .single()

    const config = configRow?.value || {}
    const qrPath = config.admin_qr_path || "c5875d4c-9f84-4a37-a146-8ed958101902/yape-qr"

    // 2. Download QR file from bucket
    const { data, error } = await supabase
      .storage
      .from("payment-qrs")
      .download(qrPath)

    if (error || !data) {
      console.error("[QR Image Route] Error downloading QR:", error)
      return NextResponse.json({ error: "QR no encontrado" }, { status: 404 })
    }

    const buffer = await data.arrayBuffer()
    const contentType = data.type || "image/png"

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("[QR Image Route] Internal error:", error)
    return NextResponse.json({ error: "Error al obtener imagen QR" }, { status: 500 })
  }
}
