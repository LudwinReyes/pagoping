import { NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/api-auth"

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { channel } = body

    if (channel !== "android_notification" && channel !== "email") {
      return NextResponse.json(
        { error: "Canal inválido. Usa 'android_notification' o 'email'." },
        { status: 400 }
      )
    }

    // Call Supabase RPC set_capture_channel
    const { error: rpcError } = await auth.supabase.rpc(
      "set_capture_channel",
      { p_channel: channel }
    )

    if (rpcError) {
      console.warn("[capture-channel] RPC failed, fallback to direct update:", rpcError.message)
      const { error: updateError } = await auth.supabase
        .from("subscriptions")
        .update({ capture_channel: channel })
        .eq("user_id", auth.user.id)

      if (updateError) {
        throw updateError
      }
    }

    return NextResponse.json({
      success: true,
      capture_channel: channel,
    })
  } catch (error) {
    console.error("[capture-channel] Error updating capture channel:", error)
    return NextResponse.json(
      { error: "Error al actualizar el canal de recepción" },
      { status: 500 }
    )
  }
}
