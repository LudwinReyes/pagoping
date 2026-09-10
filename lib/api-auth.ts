import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js"

export interface AuthenticatedRequest {
  token: string
  user: User
  supabase: SupabaseClient
}

function getSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!value) throw new Error("NEXT_PUBLIC_SUPABASE_URL no está configurado")
  return value
}

function getPublishableKey() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!value) throw new Error("La clave pública de Supabase no está configurada")
  return value
}

export async function authenticateRequest(request: Request): Promise<AuthenticatedRequest | null> {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return null

  const token = authHeader.slice(7).trim()
  if (!token) return null

  const supabase = createClient(getSupabaseUrl(), getPublishableKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
  })

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) return null
  return { token, user, supabase }
}

export function createServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY no está configurada")

  return createClient(getSupabaseUrl(), serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

export function isAdmin(user: User) {
  const configuredAdmin = process.env.ADMIN_EMAIL || "ludwintac@gmail.com"
  return user.app_metadata?.role === "admin" || user.email?.toLowerCase() === configuredAdmin.toLowerCase()
}
