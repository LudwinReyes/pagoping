-- ============================================================
-- AGREGAR COLUMNA fcm_token para Push Notifications
-- EJECUTAR EN SUPABASE SQL EDITOR
-- ============================================================

-- Agregar columna fcm_token a la tabla devices
ALTER TABLE devices 
ADD COLUMN IF NOT EXISTS fcm_token TEXT;

-- Verificar que la columna se agregó
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'devices';
