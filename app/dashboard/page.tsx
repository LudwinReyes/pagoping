"use client"

import { useEffect, useState } from "react"
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

      const loadData = async () => {
        const token = localStorage.getItem("auth_token")

        const subscriptionResponse = await fetch("/api/user/subscription", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const subscriptionData = subscriptionResponse.ok ? await subscriptionResponse.json() : { subscription: null }

        console.log("[v0] Dashboard - Subscription loaded:", subscriptionData.subscription)

        const paymentsResponse = await fetch("/api/user/payments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const paymentsData = paymentsResponse.ok
          ? await paymentsResponse.json()
          : { todayPayments: [], recentPayments: [] }

        const devicesResponse = await fetch("/api/user/devices", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const devicesData = devicesResponse.ok ? await devicesResponse.json() : { devices: [] }

        setData({
          subscription: subscriptionData.subscription,
          todayPayments: paymentsData.todayPayments || [],
          recentPayments: paymentsData.recentPayments || [],
          devices: devicesData.devices || [],
        })
        setIsLoadingData(false)
      }

      loadData()

      // No more polling - Realtime subscription in ClientDashboard handles updates
    }
  }, [session, loading, router])

  // Function to reload data (called by Realtime subscription)
  const handleRefresh = async () => {
    console.log('[v0] Dashboard - Realtime triggered refresh')
    const token = localStorage.getItem("auth_token")

    const paymentsResponse = await fetch("/api/user/payments", {
      headers: { Authorization: `Bearer ${token}` },
    })
    const paymentsData = paymentsResponse.ok
      ? await paymentsResponse.json()
      : { todayPayments: [], recentPayments: [] }

    const devicesResponse = await fetch("/api/user/devices", {
      headers: { Authorization: `Bearer ${token}` },
    })
    const devicesData = devicesResponse.ok ? await devicesResponse.json() : { devices: [] }

    setData(prev => ({
      ...prev,
      todayPayments: paymentsData.todayPayments || [],
      recentPayments: paymentsData.recentPayments || [],
      devices: devicesData.devices || [],
    }))
  }

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
      onRefresh={handleRefresh}
    />
  )
}
