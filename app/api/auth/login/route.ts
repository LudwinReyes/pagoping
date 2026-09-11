import { createClient } from "@/lib/server"
import { NextResponse } from "next/server"
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(6).max(256),
})

export async function POST(request: Request) {
  const parsed = credentialsSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Credenciales no válidas" }, { status: 400 })
  }
  const { email, password } = parsed.data

  const supabase = await createClient()

  const { error, data: authData } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 })
  }

  return NextResponse.json(
    {
      success: true,
      redirectTo: authData.user.app_metadata?.role === "admin" ? "/admin" : "/dashboard",
    },
    { status: 200 },
  )
}
