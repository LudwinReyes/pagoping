"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AdminDashboard } from "@/components/admin-dashboard"
import type { Subscription } from "@/lib/types"
import { useState } from "react"

export default function AdminPage() {
  const { session, loading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<{ subscriptions: Subscription[]; paymentsPerUser: Record<string, number> }>({
    subscriptions: [],
    paymentsPerUser: {},
  })
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!session || session.user?.email !== "ludwintac@gmail.com") {
        console.log("[v0] Admin Page - Not authenticated or not admin, redirecting")
        router.push("/auth/login")
        return
      }

      const loadData = async () => {
        try {
          const token = localStorage.getItem("auth_token")
          const response = await fetch("/api/admin/subscriptions", {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          })
          const result = await response.json()

          if (response.ok) {
            setData(result)
          } else {
            console.error("Error fetching data:", result.error)
          }
        } catch (error) {
          console.error("Error loading admin data:", error)
        } finally {
          setIsLoadingData(false)
        }
      }

      loadData()
    }
  }, [session, loading, router])

  if (loading || isLoadingData) {
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
      subscriptions={data.subscriptions}
      paymentsPerUser={data.paymentsPerUser}
      adminEmail={session?.user?.email || ""}
    />
  )
}
