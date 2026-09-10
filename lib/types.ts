export type PlanTier = "free" | "basic" | "business" | "annual"

export interface Subscription {
  user_id: string
  email: string
  tier: PlanTier
  starts_at: string
  ends_at: string | null
  validations_count: number
  max_validations: number
  max_devices: number
  can_export: boolean
  is_active: boolean
  created_at: string
  deviceCount?: number
  business_name?: string
  owner_name?: string
  display_name?: string
  phone_number?: string
}

export interface Payment {
  id: string
  user_id: string
  device_id: string
  sender_name: string
  amount: number
  operation_code: string
  raw_message: string
  notification_hash: string
  created_at: string
}

export interface Device {
  device_id: string
  user_id: string
  device_name: string
  last_seen: string
  created_at: string
  role?: "listener" | "viewer"
  pairing_token?: string
  is_paired?: boolean
  is_active?: boolean
}

export const PLAN_CONFIG = {
  free: {
    name: "Gratis",
    color: "bg-muted text-muted-foreground",
    maxValidations: 5,
    maxDevices: 1,
    canExport: false,
    duration: null,
  },
  basic: {
    name: "Básico",
    color: "bg-blue-500/20 text-blue-600",
    maxValidations: 99999999,
    maxDevices: 1,
    canExport: false,
    duration: 30,
  },
  business: {
    name: "Negocio",
    color: "bg-amber-500/20 text-amber-600",
    maxValidations: 99999999,
    maxDevices: 3,
    canExport: true,
    duration: 30,
  },
  annual: {
    name: "Anual",
    color: "bg-emerald-500/20 text-emerald-600",
    maxValidations: 99999999,
    maxDevices: 3,
    canExport: true,
    duration: 365,
  },
} as const
