import { NextResponse } from "next/server"
import { authenticateRequest, createServiceRoleClient, isAdmin } from "@/lib/api-auth"

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth || !isAdmin(auth.user)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const supabase = createServiceRoleClient()

    // 1. Get gateway config
    const { data: configRow } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "gateway_settings")
      .single()

    const config = configRow?.value || {}
    const qrPath = config.admin_qr_path || "c5875d4c-9f84-4a37-a146-8ed958101902/yape-qr"

    const { data: signedData } = await supabase
      .storage
      .from("payment-qrs")
      .createSignedUrl(qrPath, 3600)

    // 2. Get recent subscription orders
    const { data: orders } = await supabase
      .from("subscription_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    return NextResponse.json({
      settings: {
        admin_yape_name: config.admin_yape_name || "Ludwin Roy Reyes",
        admin_yape_phone: config.admin_yape_phone || "900461720",
        admin_yape_email: config.admin_yape_email || "ludwinrey.s@gmail.com",
        admin_qr_url: signedData?.signedUrl || "",
        admin_qr_path: qrPath,
      },
      orders: orders || [],
    })
  } catch (error) {
    console.error("[Admin Gateway Settings] Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth || !isAdmin(auth.user)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const supabase = createServiceRoleClient()

    let admin_yape_name = ""
    let admin_yape_phone = ""
    let admin_yape_email = ""
    let newQrPath: string | null = null

    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      admin_yape_name = (formData.get("admin_yape_name") as string) || ""
      admin_yape_phone = (formData.get("admin_yape_phone") as string) || ""
      admin_yape_email = (formData.get("admin_yape_email") as string) || ""
      const file = formData.get("qr_file") as File | null

      if (file && file.size > 0) {
        const ext = file.name.split(".").pop() || "png"
        const storagePath = `gateway/yape-qr-${Date.now()}.${ext}`
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { error: uploadError } = await supabase.storage
          .from("payment-qrs")
          .upload(storagePath, buffer, {
            contentType: file.type || "image/png",
            upsert: true,
          })

        if (uploadError) {
          console.error("[Admin Gateway Settings] Upload QR error:", uploadError)
          return NextResponse.json({ error: "Error al subir la imagen del QR" }, { status: 500 })
        }

        newQrPath = storagePath
      }
    } else {
      const body = await request.json()
      admin_yape_name = body.admin_yape_name || ""
      admin_yape_phone = body.admin_yape_phone || ""
      admin_yape_email = body.admin_yape_email || ""
      newQrPath = body.admin_qr_path || null
    }

    // Get current config
    const { data: current } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "gateway_settings")
      .single()

    const currentVal = current?.value || {}
    const updatedVal = {
      ...currentVal,
      ...(admin_yape_name ? { admin_yape_name: admin_yape_name.trim() } : {}),
      ...(admin_yape_phone ? { admin_yape_phone: admin_yape_phone.trim() } : {}),
      ...(admin_yape_email ? { admin_yape_email: admin_yape_email.trim() } : {}),
      ...(newQrPath ? { admin_qr_path: newQrPath.trim() } : {}),
    }

    const { error } = await supabase
      .from("app_config")
      .upsert({
        key: "gateway_settings",
        value: updatedVal,
      })

    if (error) {
      console.error("[Admin Gateway Settings] Update error:", error)
      return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 })
    }

    let signedUrl = ""
    const qrPathToSign = updatedVal.admin_qr_path || "c5875d4c-9f84-4a37-a146-8ed958101902/yape-qr"
    const { data: signedData } = await supabase
      .storage
      .from("payment-qrs")
      .createSignedUrl(qrPathToSign, 3600)

    if (signedData) {
      signedUrl = signedData.signedUrl
    }

    return NextResponse.json({
      success: true,
      settings: {
        admin_yape_name: updatedVal.admin_yape_name || "Ludwin Roy Reyes",
        admin_yape_phone: updatedVal.admin_yape_phone || "900461720",
        admin_yape_email: updatedVal.admin_yape_email || "ludwinrey.s@gmail.com",
        admin_qr_url: signedUrl,
        admin_qr_path: qrPathToSign,
      },
    })
  } catch (error) {
    console.error("[Admin Gateway Settings] Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
