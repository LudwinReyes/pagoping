import { createClient } from "@supabase/supabase-js"

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Falta la variable de entorno ${name}`)
  return value
}

const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY")
const ADMIN_EMAIL = requireEnv("PAGOPING_ADMIN_EMAIL")
const ADMIN_PASSWORD = requireEnv("PAGOPING_ADMIN_PASSWORD")

if (ADMIN_PASSWORD.length < 12) {
  throw new Error("PAGOPING_ADMIN_PASSWORD debe tener al menos 12 caracteres")
}

async function createAdminUser() {
  // Usar service role key para crear usuarios sin confirmación de email
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  console.log("Creando usuario administrador...")

  // Crear usuario con el Admin API
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true, // Confirmar email automáticamente
    app_metadata: { role: "admin" },
  })

  if (error) {
    if (error.message.includes("already been registered")) {
      console.log("El usuario admin ya existe. Omitiendo creación.")
      return
    }
    console.error("Error creando usuario:", error.message)
    return
  }

  console.log("Usuario admin creado exitosamente!")
  console.log("ID:", data.user.id)
  console.log("Email:", data.user.email)

  // Verificar que se creó la suscripción (el trigger lo hace automáticamente)
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", data.user.id)
    .single()

  if (subError) {
    console.log("Nota: La suscripción se creará automáticamente al iniciar sesión")
  } else {
    console.log("Suscripción creada:", subscription.tier)
  }
}

createAdminUser()
