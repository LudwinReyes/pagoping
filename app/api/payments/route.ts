import { createClient } from "@/lib/server"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { sender_name, amount, operation_code, raw_message, device_id } = body

    // Validar datos requeridos
    if (!sender_name || !amount || !operation_code || !device_id) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Generar hash único para evitar duplicados
    const notification_hash = crypto
      .createHash("sha256")
      .update(`${user.id}-${operation_code}-${amount}-${sender_name}`)
      .digest("hex")

    // Intentar insertar el pago (el trigger validará permisos)
    const { data, error } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        device_id,
        sender_name,
        amount: Number.parseFloat(amount.replace(/[^0-9.]/g, "")),
        operation_code,
        raw_message: raw_message || "",
        notification_hash,
      })
      .select()
      .single()

    if (error) {
      // Manejar errores específicos del trigger
      if (error.message.includes("PLAN_EXPIRED")) {
        return NextResponse.json({ error: "Tu plan ha vencido", code: "PLAN_EXPIRED" }, { status: 403 })
      }
      if (error.message.includes("FREE_LIMIT_REACHED")) {
        return NextResponse.json(
          { error: "Has alcanzado el límite de validaciones gratuitas", code: "FREE_LIMIT_REACHED" },
          { status: 403 },
        )
      }
      if (error.message.includes("DEVICE_LIMIT")) {
        return NextResponse.json(
          { error: "Has alcanzado el límite de dispositivos", code: "DEVICE_LIMIT" },
          { status: 403 },
        )
      }
      if (error.message.includes("unique_payment_per_user")) {
        return NextResponse.json({ error: "Pago duplicado", code: "DUPLICATE" }, { status: 409 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, payment: data })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener pagos del usuario
    const { data: payments, error } = await supabase
      .from("payments")
      .select("id,user_id,device_id,sender_name,amount,operation_code,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ payments })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
