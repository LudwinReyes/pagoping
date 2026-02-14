import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization")
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const token = authHeader.replace("Bearer ", "")
        const payload = JSON.parse(atob(token.split(".")[1]))
        const userEmail = payload.email
        const userId = payload.sub

        // Create client with anon key
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Fetch all subscriptions to see what's in the database
        const { data: allSubscriptions, error: subsError } = await supabase
            .from("subscriptions")
            .select("*")
            .limit(10)

        // Fetch all payments to see what's in the database
        const { data: allPayments, error: paymentsError } = await supabase
            .from("payments")
            .select("*")
            .limit(10)

        return NextResponse.json({
            debug: {
                tokenEmail: userEmail,
                tokenUserId: userId,
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
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
