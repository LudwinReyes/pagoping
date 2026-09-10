"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/client"
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import type { Subscription, PlanTier } from "@/lib/types"
import { PLAN_CONFIG } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Users,
  Bookmark,
  TrendingUp,
  Search,
  Settings,
  LogOut,
  Loader2,
  AlertCircle,
  Info,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"

interface SubscriptionWithDevices extends Subscription {
  deviceCount?: number
}

interface AdminDashboardProps {
  subscriptions: Subscription[]
  adminEmail: string
}

export function AdminDashboard({ subscriptions, adminEmail }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<SubscriptionWithDevices | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newPlan, setNewPlan] = useState<PlanTier>("free")
  const [isAnnualCycle, setIsAnnualCycle] = useState(false)
  const [customEndDate, setCustomEndDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subs, setSubs] = useState<SubscriptionWithDevices[]>(subscriptions)
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const realtimeRefreshRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Function to load subscriptions from API
  const loadSubscriptions = async (search?: string) => {
    try {
      const token = localStorage.getItem("auth_token")

      if (!token) {
        setError("No autenticado")
        setLoading(false)
        return
      }

      const url = search && search.length >= 2
        ? `/api/admin/subscriptions?search=${encodeURIComponent(search)}`
        : "/api/admin/subscriptions"

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error loading subscriptions")
      }

      const data = await response.json()
      setSubs(data.subscriptions)
      setError(null)
    } catch (err) {
      console.error("[v0] AdminDashboard - Error:", err)
      setError("Error cargando datos")
    } finally {
      setLoading(false)
      setIsSearching(false)
    }
  }

  // Supabase Realtime subscription - listen for changes to subscriptions table
  useEffect(() => {
    const supabase = createClient()
    const scheduleRefresh = () => {
      if (realtimeRefreshRef.current) clearTimeout(realtimeRefreshRef.current)
      realtimeRefreshRef.current = setTimeout(() => loadSubscriptions(), 500)
    }

    // Subscribe to changes on the subscriptions table
    const channel = supabase
      .channel('admin-subscriptions-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subscriptions' },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          console.log('[v0] Realtime: Subscriptions changed', payload.eventType)
          scheduleRefresh()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'devices' },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          console.log('[v0] Realtime: Devices changed', payload.eventType)
          scheduleRefresh()
        }
      )
      .subscribe()

    return () => {
      if (realtimeRefreshRef.current) clearTimeout(realtimeRefreshRef.current)
      supabase.removeChannel(channel)
    }
  }, [])

  // Debounced search - triggers API call 500ms after user stops typing
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // If search is empty, reload all subscriptions
    if (searchTerm.length === 0) {
      searchTimeoutRef.current = setTimeout(() => loadSubscriptions(), 0)
      return () => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
      }
    }

    // If search term is too short, don't search
    if (searchTerm.length < 2) {
      return
    }

    // Set a timeout to debounce the search
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(true)
      console.log('[v0] Searching for:', searchTerm)
      loadSubscriptions(searchTerm)
    }, 500)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchTerm])

  const stats = {
    total: subs.length,
    free: subs.filter((s) => s.tier === "free").length,
    basic: subs.filter((s) => s.tier === "basic").length,
    business: subs.filter((s) => s.tier === "business" || s.tier === "annual").length,
    expired: subs.filter((s) => s.ends_at && new Date(s.ends_at) < new Date()).length,
  }

  // Calculate % change (mock for demo - would need real historical data)
  const totalGrowth = stats.total > 0 ? "+12%" : "0%"
  const businessGrowth = stats.business > 0 ? "+5%" : "0%"

  const handleEditUser = (sub: SubscriptionWithDevices) => {
    setSelectedUser(sub)
    setNewPlan(sub.tier)
    setIsAnnualCycle(sub.tier === "annual")
    if (sub.ends_at) {
      setCustomEndDate(format(new Date(sub.ends_at), "yyyy-MM-dd"))
    } else {
      const duration = PLAN_CONFIG[sub.tier]?.duration || 30
      setCustomEndDate(format(addDays(new Date(), duration), "yyyy-MM-dd"))
    }
    setIsModalOpen(true)
  }

  // Calculate new end date based on plan and cycle
  const calculateEndDate = (plan: PlanTier, annual: boolean): string => {
    if (plan === "free") return ""

    // Base date: if user has active plan, extend from current end date; otherwise from today
    const baseDate = selectedUser?.ends_at && new Date(selectedUser.ends_at) > new Date()
      ? new Date(selectedUser.ends_at)
      : new Date()

    const days = annual ? 365 : (PLAN_CONFIG[plan]?.duration || 30)
    return format(addDays(baseDate, days), "yyyy-MM-dd")
  }

  const handlePlanChange = (plan: PlanTier) => {
    setNewPlan(plan)
    if (plan === "free") {
      setCustomEndDate("")
      setIsAnnualCycle(false)
    } else {
      setCustomEndDate(calculateEndDate(plan, isAnnualCycle))
    }
  }

  const handleCycleChange = (annual: boolean) => {
    setIsAnnualCycle(annual)
    if (newPlan !== "free") {
      setCustomEndDate(calculateEndDate(newPlan, annual))
    }
  }

  const handleSaveChanges = async () => {
    if (!selectedUser) return

    setIsLoading(true)
    const token = localStorage.getItem("auth_token")

    // Determine actual tier for annual
    const actualTier = isAnnualCycle && newPlan !== "free" ? "annual" : newPlan

    const response = await fetch("/api/admin/update-plan", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: selectedUser.user_id,
        tier: actualTier,
        endDate: actualTier === "free" ? null : customEndDate,
        maxValidations: PLAN_CONFIG[actualTier].maxValidations,
        maxDevices: PLAN_CONFIG[actualTier].maxDevices,
        canExport: PLAN_CONFIG[actualTier].canExport,
      }),
    })

    setIsLoading(false)

    if (response.ok) {
      const dataResponse = await fetch("/api/admin/subscriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (dataResponse.ok) {
        const data = await dataResponse.json()
        setSubs(data.subscriptions)
      }

      setIsModalOpen(false)
    } else {
      const error = await response.json()
      console.error("[v0] Error saving changes:", error)
      alert("Error guardando cambios: " + (error.error || "Error desconocido"))
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    router.push("/auth/login")
  }

  const getPlanBadge = (tier: PlanTier) => {
    const config: Record<PlanTier, { bg: string; text: string; label: string }> = {
      free: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-500", label: "Gratis" },
      basic: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", label: "Básico" },
      business: { bg: "bg-purple-50 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", label: "Negocio" },
      annual: { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", label: "Anual" },
    }
    const c = config[tier]
    return <Badge className={`${c.bg} ${c.text} border-0 font-medium`}>{c.label}</Badge>
  }

  const getStatusBadge = (sub: Subscription) => {
    const isExpired = sub.ends_at && new Date(sub.ends_at) < new Date()
    const isLimitReached = sub.tier === "free" && sub.validations_count >= sub.max_validations

    if (isExpired || isLimitReached) {
      return (
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
          <XCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Vencido</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm font-medium">Activo</span>
      </div>
    )
  }

  // Get staff count display with progress bar
  const getStaffDisplay = (sub: SubscriptionWithDevices) => {
    const current = sub.deviceCount || 0
    const max = sub.max_devices
    const percentage = max > 0 ? (current / max) * 100 : 0

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600 dark:text-slate-400">{current} / {max}</span>
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    )
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-slate-500">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600">{error}</CardContent>
        </Card>
      </div>
    )
  }

  // Calculate summary text for modal
  const getSummaryText = () => {
    if (newPlan === "free") {
      return "Plan Gratis (Indefinido). Sin dispositivos staff ni exportación."
    }

    const planName = { basic: "Básico", business: "Negocio", annual: "Anual", free: "Gratis" }[newPlan] || newPlan
    const cycle = isAnnualCycle ? "Anual" : "Mensual"
    const devices = PLAN_CONFIG[isAnnualCycle ? "annual" : newPlan]?.maxDevices || 1
    const endDateFormatted = customEndDate ? format(new Date(customEndDate), "d 'de' MMMM 'de' yyyy", { locale: es }) : ""

    return `Plan ${planName} (${cycle}). Se habilitarán ${devices} dispositivos staff hasta el ${endDateFormatted}.`
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
      {/* Header with glassmorphism */}
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl safe-top">
        <div className="container mx-auto flex h-16 items-center justify-between px-3.5 sm:px-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Logo size="sm" asLink={false} />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 w-fit">
                Panel Admin
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate hidden sm:block">{adminEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2.5 sm:px-3"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-3.5 sm:p-5 md:p-6 space-y-5 sm:space-y-6">
        {/* Title Section */}
        <div>
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Dashboard Administrativo</h1>
            <Badge className="bg-purple-600 text-white border-0 text-[10px] sm:text-xs">Admin</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Monitorea y gestiona las suscripciones de tus clientes en tiempo real.</p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Total Clients */}
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div className="p-2 sm:p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/30">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">{totalGrowth}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-3 sm:mt-4">Total Clientes</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
            </CardContent>
          </Card>

          {/* Plan Gratis */}
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
            <CardContent className="p-4 sm:p-5">
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 w-fit">
                <Bookmark className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-3 sm:mt-4">Plan Gratis</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stats.free}</p>
            </CardContent>
          </Card>

          {/* Plan Básico */}
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
            <CardContent className="p-4 sm:p-5">
              <div className="p-2 sm:p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 w-fit">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-3 sm:mt-4">Plan Básico</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stats.basic}</p>
            </CardContent>
          </Card>

          {/* Plan Negocio */}
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div className="p-2 sm:p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/30">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">{businessGrowth}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-3 sm:mt-4">Plan Negocio</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stats.business}</p>
            </CardContent>
          </Card>

          {/* Vencidos */}
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800 col-span-2 sm:col-span-1 lg:col-span-1">
            <CardContent className="p-4 sm:p-5">
              <div className="p-2 sm:p-2.5 rounded-xl bg-red-50 dark:bg-red-900/30 w-fit">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-3 sm:mt-4">Vencidos</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-500">{stats.expired}</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Gestión de Clientes</CardTitle>
                <CardDescription className="text-slate-500">Administra los planes y estados de tus clientes registrados.</CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Buscar por correo o negocio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-6">
            {/* Mobile Cards List for phones */}
            <div className="block md:hidden space-y-3">
              {subs.length === 0 ? (
                <p className="text-center py-8 text-slate-500 text-sm">
                  {isSearching ? "Buscando..." : "No se encontraron usuarios"}
                </p>
              ) : (
                subs.map((sub: SubscriptionWithDevices) => (
                  <div
                    key={sub.user_id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 shadow-sm space-y-3"
                  >
                    {/* Top: Business & Plan */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                          <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                            {sub.business_name || sub.display_name || sub.owner_name || "Sin nombre"}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{sub.email}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        {getPlanBadge(sub.tier)}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(sub)}
                          className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl"
                          aria-label="Gestionar cliente"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Middle Details Grid */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-700/50 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Estado</span>
                        <div className="mt-1">{getStatusBadge(sub)}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Teléfono</span>
                        <div className="mt-1">
                          {sub.phone_number ? (
                            <a
                              href={`https://wa.me/51${sub.phone_number.replace(/\s/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-emerald-600 font-medium hover:underline"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {sub.phone_number}
                            </a>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Staff Vinculado</span>
                        <div className="mt-1">{getStaffDisplay(sub)}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Vencimiento</span>
                        <div className="mt-1">
                          {sub.ends_at ? (
                            <span className={`font-medium ${new Date(sub.ends_at) < new Date() ? "text-red-500" : "text-slate-600 dark:text-slate-400"}`}>
                              {format(new Date(sub.ends_at), "dd/MM/yyyy", { locale: es })}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuario</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Negocio</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teléfono</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Staff</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vence</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {subs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-500">
                        {isSearching ? "Buscando..." : "No se encontraron usuarios"}
                      </td>
                    </tr>
                  ) : (
                    subs.map((sub: SubscriptionWithDevices) => (
                      <tr key={sub.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-600 dark:text-slate-400">{sub.email}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {sub.business_name || sub.display_name || sub.owner_name || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {sub.phone_number ? (
                            <a
                              href={`https://wa.me/51${sub.phone_number.replace(/\s/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                            >
                              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                              {sub.phone_number}
                            </a>
                          ) : (
                            <span className="text-sm text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">{getPlanBadge(sub.tier)}</td>
                        <td className="py-4 px-4">{getStatusBadge(sub)}</td>
                        <td className="py-4 px-4">{getStaffDisplay(sub)}</td>
                        <td className="py-4 px-4">
                          {sub.ends_at ? (
                            <span className={`text-sm ${new Date(sub.ends_at) < new Date() ? "text-red-500" : "text-slate-600 dark:text-slate-400"}`}>
                              {format(new Date(sub.ends_at), "dd/MM/yyyy", { locale: es })}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(sub)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Edit Modal - New Design */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[92vw] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-0 shadow-2xl">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">Gestionar Suscripción</DialogTitle>
            <p className="text-sm text-slate-500">{selectedUser?.email}</p>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-6">
            {/* Plan Selection - Grid Buttons */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Plan de Suscripción</label>
              <div className="grid grid-cols-3 gap-2">
                {(["free", "basic", "business"] as const).map((plan) => {
                  const isSelected = newPlan === plan || (isAnnualCycle && plan === "business" && newPlan === "business")
                  return (
                    <button
                      key={plan}
                      onClick={() => handlePlanChange(plan)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 active:scale-95
                        ${isSelected
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                        }`}
                    >
                      {{ free: "Gratis", basic: "Básico", business: "Negocio" }[plan]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Cycle Toggle - Monthly vs Annual */}
            {newPlan !== "free" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ciclo de Renovación</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => handleCycleChange(false)}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200
                      ${!isAnnualCycle
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    Mensual (30 días)
                  </button>
                  <button
                    onClick={() => handleCycleChange(true)}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5
                      ${isAnnualCycle
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    Anual (365 días)
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  </button>
                </div>
              </div>
            )}

            {/* End Date */}
            {newPlan !== "free" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nueva Fecha de Vencimiento</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Summary Box */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4">
              <div className="flex gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-full h-fit">
                  <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Resumen de cambios</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{getSummaryText()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 active:scale-95 transition-transform"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
