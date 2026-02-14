-- Agregar campos faltantes para Perfil y Colaboradores detectados en los diseños

-- 1. Tabla SUBSCRIPTIONS (Perfil de Negocio)
-- Necesitamos el nombre del negocio (ej: "ICE-Digital")
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS display_name TEXT DEFAULT 'Mi Negocio';

-- 2. Tabla DEVICES (Colaboradores)
-- Necesitamos el teléfono del colaborador y un estado activo/inactivo explícito (toggle)
ALTER TABLE devices ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE devices ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Actualizar la política de seguridad para permitir ver estos nuevos campos
-- (Las políticas existentes de SELECT ya deberían cubrirlos si hacen SELECT *)
