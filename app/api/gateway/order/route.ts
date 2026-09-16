import { NextResponse } from "next/server"
import { authenticateRequest, createServiceRoleClient } from "@/lib/api-auth"

const PRICING_MAP: Record<string, { monthly: number; annual: number }> = {
  basic: { monthly: 15, annual: 156 },
  business: { monthly: 30, annual: 300 },
  enterprise: { monthly: 60, annual: 600 },
}

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { planTier, billingCycle, yapeSenderName } = body

    if (!["basic", "business", "enterprise"].includes(planTier)) {
      return NextResponse.json({ error: "Plan seleccionado no válido" }, { status: 400 })
    }

    if (!["monthly", "annual"].includes(billingCycle)) {
      return NextResponse.json({ error: "Ciclo de facturación no válido" }, { status: 400 })
    }

    const pricing = PRICING_MAP[planTier]
    const amount = billingCycle === "annual" ? pricing.annual : pricing.monthly

    const supabase = createServiceRoleClient()

    // Expire any older pending orders for this user to avoid confusion
    await supabase
      .from("subscription_orders")
      .update({ status: "cancelled" })
      .eq("user_id", auth.user.id)
      .eq("status", "pending")

    // Create the new subscription order
    const { data: order, error } = await supabase
      .from("subscription_orders")
      .insert({
        user_id: auth.user.id,
        user_email: auth.user.email || "",
        plan_tier: planTier,
        billing_cycle: billingCycle,
        amount,
        sender_name: yapeSenderName ? yapeSenderName.trim() : null,
        status: "pending",
      })
      .select()
      .single()

    if (error || !order) {
      console.error("[Gateway Order] Insert error:", error)
      return NextResponse.json({ error: "Error al crear la orden de suscripción" }, { status: 500 })
    }

    return NextResponse.json({
      order,
    })
  } catch (error) {
    console.error("[Gateway Order] Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
