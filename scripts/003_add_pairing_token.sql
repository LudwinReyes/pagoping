-- Agregar pairing_token a devices para vincular empleados vía QR
ALTER TABLE devices ADD COLUMN IF NOT EXISTS pairing_token TEXT;
ALTER TABLE devices ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'listener';
ALTER TABLE devices ADD COLUMN IF NOT EXISTS is_paired BOOLEAN DEFAULT FALSE;

-- Crear índice para búsqueda rápida de tokens
CREATE INDEX IF NOT EXISTS idx_devices_pairing_token ON devices(pairing_token);

-- Policy para que usuarios puedan crear dispositivos pendientes (QR)
DROP POLICY IF EXISTS "Usuarios insertan dispositivos" ON devices;
CREATE POLICY "Usuarios insertan dispositivos" ON devices FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy para que usuarios puedan actualizar sus dispositivos
DROP POLICY IF EXISTS "Usuarios actualizan dispositivos" ON devices;
CREATE POLICY "Usuarios actualizan dispositivos" ON devices FOR UPDATE USING (auth.uid() = user_id);

-- Policy para que usuarios puedan eliminar sus dispositivos
DROP POLICY IF EXISTS "Usuarios eliminan dispositivos" ON devices;
CREATE POLICY "Usuarios eliminan dispositivos" ON devices FOR DELETE USING (auth.uid() = user_id);
