"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ClientDashboard } from "@/components/client-dashboard"
import type { Subscription, Payment, Device } from "@/lib/types"

export default function DashboardPage() {
  const { session, loading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<{
    subscription: Subscription | null
    todayPayments: Payment[]
    recentPayments: Payment[]
    devices: Device[]
  }>({
    subscription: null,
    todayPayments: [],
    recentPayments: [],
    devices: [],
  })
  const [isLoadingData, setIsLoadingData] = useState(true)

  const loadDashboardData = useCallback(async () => {
    const token = localStorage.getItem("auth_token")
    const response = await fetch("/api/user/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })

    if (!response.ok) throw new Error("No se pudo cargar el panel")

    const dashboardData = await response.json()
    setData({
      subscription: dashboardData.subscription,
      todayPayments: dashboardData.todayPayments || [],
      recentPayments: dashboardData.recentPayments || [],
      devices: dashboardData.devices || [],
    })
  }, [])

  useEffect(() => {
    if (!loading) {
      if (!session) {
        console.log("[v0] Dashboard Page - Not authenticated, redirecting")
        router.push("/auth/login")
        return
      }

      if (session.user?.email === "ludwintac@gmail.com") {
        console.log("[v0] Dashboard Page - Is admin, redirecting to /admin")
        router.push("/admin")
        return
      }

      const timer = window.setTimeout(() => {
        loadDashboardData()
          .catch((error) => console.error("Error cargando el panel:", error))
          .finally(() => setIsLoadingData(false))
      }, 0)

      // No more polling - Realtime subscription in ClientDashboard handles updates
      return () => window.clearTimeout(timer)
    }
  }, [session, loading, router, loadDashboardData])

  const handlePaymentInserted = useCallback((payment: Payment) => {
    const dayKey = (value: string | Date) =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Lima",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(value))

    setData((previous) => {
      const recentPayments = [
        payment,
        ...previous.recentPayments.filter((item) => item.id !== payment.id),
      ].slice(0, 30)
      const isToday = dayKey(payment.created_at) === dayKey(new Date())
      const todayPayments = isToday
        ? [payment, ...previous.todayPayments.filter((item) => item.id !== payment.id)]
        : previous.todayPayments

      return { ...previous, recentPayments, todayPayments }
    })
  }, [])

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-primary/70">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <ClientDashboard
      subscription={data.subscription}
      todayPayments={data.todayPayments}
      recentPayments={data.recentPayments}
      devices={data.devices}
      userEmail={session?.user?.email || ""}
      onRefresh={loadDashboardData}
      onPaymentInserted={handlePaymentInserted}
    />
  )
}
