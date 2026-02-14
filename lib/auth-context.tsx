"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"

interface AuthContextType {
  session: Session | null
  loading: boolean
  user: User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const authToken = localStorage.getItem("auth_token")
        const authUser = localStorage.getItem("auth_user")

        console.log("[v0] AuthProvider - Checking auth:", { hasToken: !!authToken, hasUser: !!authUser })

        if (authToken && authUser) {
          console.log("[v0] AuthProvider - Session from localStorage, token exists")
          const user = JSON.parse(authUser)
          setSession({
            access_token: authToken,
            token_type: "bearer",
            expires_in: 3600,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            refresh_token: "",
            user,
          } as any)
          setLoading(false)
          return
        }

        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()

        console.log("[v0] AuthProvider - Session from Supabase:", !!currentSession)
        setSession(currentSession)
      } catch (error) {
        console.error("[v0] Error checking session:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token" && e.newValue) {
        checkSession()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading, user: session?.user || null }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
