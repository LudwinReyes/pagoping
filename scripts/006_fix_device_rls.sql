-- ============================================================
-- FIX: Políticas RLS para permitir vincular dispositivos (colaboradores)
-- EJECUTAR EN SUPABASE SQL EDITOR
-- ============================================================

-- 1. Permitir INSERT público para dispositivos (necesario para el flujo de pairing)
-- Esto permite que usuarios no autenticados puedan registrar dispositivos
CREATE POLICY "Permitir insert dispositivos para pairing" 
    ON devices 
    FOR INSERT 
    WITH CHECK (true);

-- 2. Permitir DELETE para dispositivos pendientes (necesario para reemplazar el pending device)
CREATE POLICY "Permitir delete dispositivos para pairing" 
    ON devices 
    FOR DELETE 
    USING (true);

-- 3. Permitir que el dueño actualice dispositivos de su cuenta
CREATE POLICY "Usuarios actualizan sus dispositivos" 
    ON devices 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Verificación: Mostrar todas las políticas actuales
SELECT * FROM pg_policies WHERE tablename = 'devices';
