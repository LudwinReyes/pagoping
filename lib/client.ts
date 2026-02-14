import { createBrowserClient } from "@supabase/ssr"

// El ejemplo oficial no usa singleton para el cliente del navegador
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
