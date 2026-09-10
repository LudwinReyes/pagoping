import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/api-auth"

function startOfTodayInLima() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())

  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return new Date(`${value.year}-${value.month}-${value.day}T05:00:00.000Z`).toISOString()
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const todayStart = startOfTodayInLima()

    const { data: recentPayments, error: paymentsError } = await auth.supabase
      .from("payments")
      .select("id,user_id,device_id,sender_name,amount,operation_code,created_at")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false })
      .limit(30)

    if (paymentsError) {
      console.error("[v0] API - Error fetching payments:", paymentsError)
      return NextResponse.json({ todayPayments: [], recentPayments: [] })
    }

    const { data: todayPayments, error: todayError } = await auth.supabase
      .from("payments")
      .select("id,amount,created_at")
      .eq("user_id", auth.user.id)
      .gte("created_at", todayStart)
      .order("created_at", { ascending: false })

    if (todayError) {
      console.error("[payments] Error fetching today's payments:", todayError)
      return NextResponse.json({ todayPayments: [], recentPayments: recentPayments || [] })
    }

    return NextResponse.json({
      todayPayments: todayPayments || [],
      recentPayments: recentPayments || [],
    })
  } catch (error) {
    console.error("[v0] API - Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
