# PagoPing - Documentación API para Apps Móviles

## Arquitectura

\`\`\`
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   App Dueño     │────▶│    Supabase     │◀────│  App Empleado   │
│   (Listener)    │     │   PostgreSQL    │     │    (Viewer)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │ INSERT payments       │ Realtime WS           │ SELECT payments
        │ UPDATE devices        │                       │ (solo lectura)
        └───────────────────────┴───────────────────────┘
\`\`\`

## Configuración Supabase

\`\`\`
URL: https://tgeoqtjmpypebnffhoop.supabase.co
ANON_KEY: (usar variable de entorno)
\`\`\`

---

## 1. APP DUEÑO (Modo Listener)

### 1.1 Autenticación

\`\`\`http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
\`\`\`

**Respuesta exitosa:**
\`\`\`json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com"
  }
}
\`\`\`

### 1.2 Obtener Configuración (Regex Yape)

\`\`\`http
GET /rest/v1/app_config?key=eq.yape_settings
Authorization: Bearer {access_token}
apikey: {ANON_KEY}
\`\`\`

**Respuesta:**
\`\`\`json
[{
  "key": "yape_settings",
  "value": {
    "package_name": "com.bcp.innovacxion.yapeapp",
    "regex_pattern": "^(.+?)\\s+te\\s+envi(?:o|ó)\\s+un\\s+pago...",
    "admin_email": "ludwintac@gmail.com"
  }
}]
\`\`\`

### 1.3 Verificar Suscripción

\`\`\`http
GET /rest/v1/subscriptions?user_id=eq.{uid}&select=tier,ends_at,validations_count,max_validations,max_devices
Authorization: Bearer {access_token}
apikey: {ANON_KEY}
\`\`\`

**Respuesta:**
\`\`\`json
[{
  "tier": "business",
  "ends_at": "2026-02-05T00:00:00Z",
  "validations_count": 45,
  "max_validations": 999999,
  "max_devices": 3
}]
\`\`\`

### 1.4 Registrar Pago (Función RPC)

\`\`\`http
POST /rest/v1/rpc/registrar_pago
Authorization: Bearer {access_token}
apikey: {ANON_KEY}
Content-Type: application/json

{
  "p_device_id": "android_abc123",
  "p_sender_name": "Juan Pérez",
  "p_amount": 150.50,
  "p_operation_code": "OP12345",
  "p_raw_message": "Juan Pérez te envió un pago por S/ 150.50...",
  "p_notification_hash": "md5_hash_unico"
}
\`\`\`

**Respuesta exitosa:**
\`\`\`json
{
  "success": true,
  "payment_id": "uuid-del-pago",
  "message": "Pago registrado correctamente"
}
\`\`\`

**Errores posibles:**
\`\`\`json
{ "success": false, "error": "PLAN_EXPIRED", "ends_at": "2026-01-01" }
{ "success": false, "error": "FREE_LIMIT_REACHED", "count": 5 }
{ "success": false, "error": "DUPLICATE_PAYMENT" }
{ "success": false, "error": "DEVICE_NOT_FOUND" }
\`\`\`

### 1.5 Calcular notification_hash

```kotlin
// Android/Kotlin
fun calcularHash(mensaje: String): String {
    val minutoActual = System.currentTimeMillis() / 60000
    val input = "$mensaje$minutoActual"
    return MessageDigest.getInstance("MD5")
        .digest(input.toByteArray())
        .joinToString("") { "%02x".format(it) }
}
