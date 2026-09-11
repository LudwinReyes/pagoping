import { NextResponse } from "next/server"
import { authenticateRequest, createServiceRoleClient, isAdmin } from "@/lib/api-auth"

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    if (!isAdmin(auth.user)) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

    const supabase = createServiceRoleClient()

    // Get search query parameter
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get("search")?.toLowerCase()

    let query = supabase
      .from("subscriptions")
      .select("user_id,email,tier,billing_period,starts_at,ends_at,validations_count,max_validations,max_devices,can_export,is_active,created_at,business_name,owner_name,display_name,phone_number")
      .order("created_at", { ascending: false })
      .limit(100)

    // Apply search filter if provided
    if (searchQuery && searchQuery.length >= 2) {
      console.log("[v0] API - Searching for:", searchQuery)
      query = query.or(`email.ilike.%${searchQuery}%,business_name.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%,owner_name.ilike.%${searchQuery}%`)
    }

    const { data: subscriptions, error: subsError } = await query

    if (subsError) {
      console.log("[v0] API - Subscriptions error:", subsError)
      throw subsError
    }

    const subscriptionIds = (subscriptions || []).map((subscription) => subscription.user_id)
    const { data: collaborators, error: collaboratorsError } = subscriptionIds.length
      ? await supabase.from("collaborators").select("owner_id").in("owner_id", subscriptionIds)
      : { data: [], error: null }

    if (collaboratorsError) throw collaboratorsError

    const collaboratorsPerUser: Record<string, number> = {}
    collaborators?.forEach((collaborator: { owner_id: string }) => {
      collaboratorsPerUser[collaborator.owner_id] = (collaboratorsPerUser[collaborator.owner_id] || 0) + 1
    })

    const subscriptionsWithCollaborators = subscriptions?.map((sub) => ({
      ...sub,
      collaboratorCount: collaboratorsPerUser[sub.user_id] || 0,
    }))

    return NextResponse.json({
      subscriptions: subscriptionsWithCollaborators || [],
    })
  } catch (error) {
    console.log("[v0] API - Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
