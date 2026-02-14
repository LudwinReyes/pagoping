-- ============================================================
-- CONFIGURAR DATABASE WEBHOOK PARA PUSH NOTIFICATIONS
-- Este script crea un trigger que llama a la Edge Function
-- cuando se inserta un nuevo pago
-- ============================================================

-- NOTA: Los Database Webhooks se configuran mejor desde el Dashboard de Supabase
-- Ir a: Database > Webhooks > Create Webhook
-- 
-- Configuración:
-- - Name: send-payment-notification
-- - Table: payments
-- - Events: INSERT
-- - Type: Supabase Edge Functions
-- - Edge Function: send-payment-notification

-- Alternativamente, puedes usar una Edge Function con un trigger HTTP
-- que escucha los cambios de la tabla payments

-- Para configurar manualmente:
-- 1. Ve a Supabase Dashboard > Database > Webhooks
-- 2. Click "Create a new webhook"
-- 3. Configura:
--    - Name: payment-notification-webhook
--    - Table: payments
--    - Events: INSERT
--    - HTTP Request:
--      - Method: POST
--      - URL: https://tgeoqtjmpypebnffhoop.supabase.co/functions/v1/send-payment-notification
--      - Headers: 
--        Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
--        Content-Type: application/json

SELECT 'Configura el webhook desde el Dashboard de Supabase' as instruccion;
