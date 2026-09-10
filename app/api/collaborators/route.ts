import { NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/api-auth"

const allowedActions = new Set(["list", "create", "update", "set_active", "delete"])

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) return NextResponse.json({ error: "Tu sesión venció. Inicia sesión nuevamente" }, { status: 401 })

    const body = await request.json()
    if (!allowedActions.has(String(body.action ?? ""))) {
      return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !publishableKey) {
      return NextResponse.json({ error: "La conexión con PagoPing no está configurada" }, { status: 500 })
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/manage-collaborator`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        apikey: publishableKey,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    const result = await response.json().catch(() => ({ error: "Respuesta inválida del servidor" }))
    return NextResponse.json(result, { status: response.status })
  } catch (error) {
    console.error("[PagoPing] Error administrando colaboradores:", error)
    return NextResponse.json({ error: "No se pudo completar la operación" }, { status: 500 })
  }
}
