import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function createAdminUser() {
  // Usar service role key para crear usuarios sin confirmación de email
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const adminEmail = "ludwintac@gmail.com"
  const adminPassword = "ludwintac@gmail.com"

  console.log("Creando usuario administrador...")

  // Crear usuario con el Admin API
  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true, // Confirmar email automáticamente
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
