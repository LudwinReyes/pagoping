import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest, createServiceRoleClient, isAdmin } from "@/lib/api-auth"

const PLAN_LIMITS = {
  free: { max_validations: 5, max_devices: 1, can_export: false },
  basic: { max_validations: 99_999_999, max_devices: 1, can_export: false },
  business: { max_validations: 99_999_999, max_devices: 3, can_export: true },
  annual: { max_validations: 99_999_999, max_devices: 3, can_export: true },
} as const

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    if (!isAdmin(auth.user)) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

    // Get request body
    const body = await request.json()
    const { userId, tier, endDate } = body

    if (!userId || !tier || !(tier in PLAN_LIMITS)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const selectedTier = tier as keyof typeof PLAN_LIMITS
    const limits = PLAN_LIMITS[selectedTier]

    const updateData: {
      tier: keyof typeof PLAN_LIMITS
      starts_at: string
      ends_at?: string | null
      max_validations: number
      max_devices: number
      can_export: boolean
    } = {
      tier: selectedTier,
      starts_at: new Date().toISOString(),
      max_validations: limits.max_validations,
      max_devices: limits.max_devices,
      can_export: limits.can_export,
    }

    if (selectedTier !== "free" && endDate) {
      updateData.ends_at = new Date(endDate).toISOString()
    } else if (selectedTier === "free") {
      updateData.ends_at = null
    }

    const { error } = await createServiceRoleClient()
      .from("subscriptions")
      .update(updateData)
      .eq("user_id", userId)

    if (error) throw error

    console.log("[v0] API - Plan updated successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API - Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
