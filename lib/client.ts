import { createBrowserClient } from "@supabase/ssr"

// El ejemplo oficial no usa singleton para el cliente del navegador
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  return createBrowserClient(url, key)
}
