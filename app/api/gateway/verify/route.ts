import { NextResponse } from "next/server"
import { authenticateRequest, createServiceRoleClient } from "@/lib/api-auth"

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, operationCode } = body

    if (!orderId) {
      return NextResponse.json({ error: "Falta el ID de la orden" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    // 1. Verify user owns this order (or is admin)
    const { data: order } = await supabase
      .from("subscription_orders")
      .select("id, user_id, status")
      .eq("id", orderId)
      .single()

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    if (order.user_id !== auth.user.id && auth.user.app_metadata?.role !== "admin") {
      return NextResponse.json({ error: "No autorizado para esta orden" }, { status: 403 })
    }

    if (order.status === "completed") {
      return NextResponse.json({
        success: true,
        already_completed: true,
        message: "Esta orden ya fue activada",
      })
    }

    // 2. Call RPC verify_and_activate_subscription_order
    const { data: result, error: rpcError } = await supabase.rpc(
      "verify_and_activate_subscription_order",
      {
        p_order_id: orderId,
        p_operation_code: operationCode ? operationCode.trim() : null,
      }
    )

    if (rpcError) {
      console.error("[Gateway Verify] RPC error:", rpcError)
      return NextResponse.json({ error: rpcError.message || "Error al verificar el pago" }, { status: 500 })
    }

    if (!result?.success) {
      return NextResponse.json({
        success: false,
        error: result?.error || "Aún no se confirma el pago",
      }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[Gateway Verify] Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
