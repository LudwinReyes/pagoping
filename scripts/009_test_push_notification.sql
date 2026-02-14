-- ============================================================
-- SCRIPT PARA SIMULAR UN PAGO YAPE Y PROBAR PUSH NOTIFICATIONS
-- EJECUTAR EN SUPABASE SQL EDITOR
-- ============================================================

-- PASO 1: Asegurar que el viewer (Samsung SM-P610) tenga el FCM token
-- Nota: El FCM token se obtiene del dispositivo cuando la app se instala
-- Si no tienes el token del SM-P610, primero corre la app ahí para obtenerlo

-- Verificar el estado actual del viewer
SELECT device_id, device_name, role, fcm_token, is_active
FROM devices 
WHERE role = 'viewer' AND user_id = '3409c11b-a156-4d0b-8da5-90912c916bba';

-- PASO 2: Si el viewer no tiene FCM token, actualizarlo
-- (Reemplaza el token con el del Samsung SM-P610)
UPDATE devices 
SET fcm_token = 'fyc9ELMZSFa9ZVB8P9k2yp:APA91bGqhpAL2OMdR-uiFq5u5FGUb_GtrxmzXQsitTYPz00fDApigYO6eZNEk0Gc9B-anZBrQiVla-P26F5WAHsUzptR_2kf_VPDkWRhsYKG7cDF0Zc2rqk',
    is_active = true
WHERE device_id = 'android_ebed1a5a';

-- PASO 3: Simular un pago Yape
-- Esto debería activar el webhook y enviar el push notification
INSERT INTO payments (
    user_id,
    device_id,
    sender_name,
    amount,
    operation_code,
    raw_message,
    notification_hash
) VALUES (
    '3409c11b-a156-4d0b-8da5-90912c916bba',  -- Owner user_id
    'android_c06f8a16',                        -- Device que "recibe" el Yape
    'Juan Prueba',                             -- Nombre del cliente
    25.50,                                     -- Monto
    '123456',                                  -- Código de operación
    'Juan Prueba te envió un pago por S/ 25.50. Tu cod. de seguridad es: 123456',
    'test_hash_' || now()::text               -- Hash único para evitar duplicados
);

-- PASO 4: Verificar que el pago se insertó
SELECT id, sender_name, amount, operation_code, created_at 
FROM payments 
ORDER BY created_at DESC 
LIMIT 1;

-- Si todo funciona, el webhook debería haberse activado
-- y el Samsung SM-P610 debería recibir una notificación push
