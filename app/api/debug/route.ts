import { NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/api-auth"

export async function GET(request: Request) {
    try {
        const auth = await authenticateRequest(request)
        if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

        // Fetch all subscriptions to see what's in the database
        const { data: allSubscriptions, error: subsError } = await auth.supabase
            .from("subscriptions")
            .select("user_id,email,tier,is_active")
            .eq("user_id", auth.user.id)
            .limit(1)

        // Fetch all payments to see what's in the database
        const { data: allPayments, error: paymentsError } = await auth.supabase
            .from("payments")
            .select("id,sender_name,amount,operation_code,created_at")
            .eq("user_id", auth.user.id)
            .order("created_at", { ascending: false })
            .limit(10)

        return NextResponse.json({
            debug: {
                tokenEmail: auth.user.email,
                tokenUserId: auth.user.id,
                envUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "set" : "missing",
                envKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "set" : "missing",
            },
            subscriptions: {
                data: allSubscriptions,
                error: subsError?.message,
                count: allSubscriptions?.length || 0,
            },
            payments: {
                data: allPayments,
                error: paymentsError?.message,
                count: allPayments?.length || 0,
            },
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error interno del servidor"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
