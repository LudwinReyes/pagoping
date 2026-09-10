"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  const { session, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!session || session.user?.email !== "ludwintac@gmail.com") {
        console.log("[v0] Admin Page - Not authenticated or not admin, redirecting")
        router.push("/auth/login")
        return
      }

    }
  }, [session, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminDashboard
      subscriptions={[]}
      adminEmail={session?.user?.email || ""}
    />
  )
}
