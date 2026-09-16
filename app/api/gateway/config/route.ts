import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/api-auth"

export async function GET() {
  try {
    const supabase = createServiceRoleClient()

    // 1. Get gateway config from app_config
    const { data: configRow } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "gateway_settings")
      .single()

    const config = configRow?.value || {}
    const qrPath = config.admin_qr_path || "c5875d4c-9f84-4a37-a146-8ed958101902/yape-qr"

    // 2. Generate signed URL for the QR code (valid for 1 hour)
    const { data: signedData } = await supabase
      .storage
      .from("payment-qrs")
      .createSignedUrl(qrPath, 3600)

    const qrUrl = signedData?.signedUrl || ""

    // 3. Return gateway settings
    return NextResponse.json({
      admin_yape_name: config.admin_yape_name || "Ludwin Roy Reyes",
      admin_yape_phone: config.admin_yape_phone || "900461720",
      admin_yape_email: config.admin_yape_email || "ludwinrey.s@gmail.com",
      admin_qr_url: qrUrl,
      plans: {
        basic: {
          name: "Plan Básico",
          monthly: 15,
          annual: 156, // S/ 13 x 12
        },
        business: {
          name: "Plan Negocio",
          monthly: 30,
          annual: 300, // S/ 25 x 12
        },
        enterprise: {
          name: "Plan Empresa",
          monthly: 60,
          annual: 600, // S/ 50 x 12
        },
      },
    })
  } catch (error) {
    console.error("[Gateway Config] Error:", error)
    return NextResponse.json({ error: "Error al cargar configuración de pasarela" }, { status: 500 })
  }
}
