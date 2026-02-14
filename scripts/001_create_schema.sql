-- Borramos tablas previas para evitar conflictos al reiniciar
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS app_config CASCADE;
DROP TYPE IF EXISTS plan_tier CASCADE;

/* ============================================================
   2. DEFINICIÓN DE PLANES (ENUMS)
   ============================================================ */
-- Definimos los niveles de suscripción como tipos de datos fijos
CREATE TYPE plan_tier AS ENUM ('free', 'basic', 'business', 'annual');

/* ============================================================
   3. TABLA DE CONFIGURACIÓN DEL SISTEMA (CEREBRO)
   ============================================================ */
-- Aquí guardamos el Regex. Si Yape cambia, actualizas esta fila.
CREATE TABLE app_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

INSERT INTO app_config (key, value) VALUES 
('yape_settings', '{
    "package_name": "com.bcp.innovacxion.yapeapp",
    "regex_pattern": "^(.+?)\\s+te\\s+envi(?:o|ó)\\s+un\\s+pago\\s+por\\s+(S\\/\\s?[0-9]+(?:\\.[0-9]{1,2})?).*cod\\.\\s+de\\s+seguridad\\s+es:\\s?([0-9]+)",
    "admin_email": "ludwintac@gmail.com"
}');

/* ============================================================
   4. TABLA DE SUSCRIPCIONES (LÓGICA DE PERMISOS)
   ============================================================ */
CREATE TABLE subscriptions (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    
    -- Estado del Plan
    tier plan_tier DEFAULT 'free',
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE,
    
    -- Contadores y Límites
    validations_count INT DEFAULT 0,
    max_validations INT DEFAULT 5,
    max_devices INT DEFAULT 1,
    can_export BOOLEAN DEFAULT FALSE,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

/* ============================================================
   5. TABLA DE DISPOSITIVOS
   ============================================================ */
CREATE TABLE devices (
    device_id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    device_name TEXT,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

/* ============================================================
   6. TABLA DE PAGOS (TRANSACCIONES)
   ============================================================ */
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    device_id TEXT REFERENCES devices(device_id),
    
    -- Datos Parseados (Limpios)
    sender_name TEXT,
    amount DECIMAL(10,2),
    operation_code TEXT,
    
    -- Datos de Auditoría
    raw_message TEXT,
    notification_hash TEXT NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- REGLA DE ORO: No permitir el mismo hash para el mismo usuario
    CONSTRAINT unique_payment_per_user UNIQUE (user_id, notification_hash)
);

/* ============================================================
   7. AUTOMATIZACIÓN (TRIGGERS)
   ============================================================ */

-- A. Cuando alguien se registra, crearle su suscripción FREE automáticamente
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, email, tier, max_validations, max_devices, can_export)
  VALUES (NEW.id, NEW.email, 'free', 5, 1, FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- B. EL GUARDIÁN: Validar permisos ANTES de guardar un pago
CREATE OR REPLACE FUNCTION guard_payment_insertion()
RETURNS TRIGGER AS $$
DECLARE
    sub RECORD;
    device_count INT;
BEGIN
    -- 1. Obtener suscripción
    SELECT * INTO sub FROM subscriptions WHERE user_id = NEW.user_id;

    -- 2. Validar Fecha de Vencimiento (Si no es free)
    IF sub.tier != 'free' AND sub.ends_at IS NOT NULL AND NOW() > sub.ends_at THEN
        RAISE EXCEPTION 'PLAN_EXPIRED: Su plan ha vencido el %', sub.ends_at;
    END IF;

    -- 3. Validar Límite de Validaciones (Solo Free)
    IF sub.tier = 'free' AND sub.validations_count >= sub.max_validations THEN
        RAISE EXCEPTION 'FREE_LIMIT_REACHED: Has alcanzado tus 5 validaciones gratuitas.';
    END IF;

    -- 4. Validar Dispositivo (Si es nuevo, verificar cupo)
    IF NOT EXISTS (SELECT 1 FROM devices WHERE device_id = NEW.device_id) THEN
        SELECT COUNT(*) INTO device_count FROM devices WHERE user_id = NEW.user_id;
        IF device_count >= sub.max_devices THEN
            RAISE EXCEPTION 'DEVICE_LIMIT: Tu plan solo permite % dispositivo(s).', sub.max_devices;
        END IF;
        -- Si hay cupo, registramos el dispositivo automáticamente
        INSERT INTO devices (device_id, user_id, device_name) VALUES (NEW.device_id, NEW.user_id, 'Nuevo Dispositivo');
    END IF;

    -- 5. Si todo pasa, incrementar contador
    UPDATE subscriptions SET validations_count = validations_count + 1 WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_limits_before_payment
  BEFORE INSERT ON payments
  FOR EACH ROW EXECUTE FUNCTION guard_payment_insertion();

/* ============================================================
   8. SEGURIDAD (Row Level Security)
   ============================================================ */
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven sus propios datos
CREATE POLICY "Usuarios ven sus pagos" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios insertan sus pagos" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios ven su plan" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios ven sus dispositivos" ON devices FOR SELECT USING (auth.uid() = user_id);

-- Admin (ludwintac@gmail.com) ve y modifica todo
CREATE POLICY "Admin ve todo pagos" ON payments FOR ALL USING (auth.jwt() ->> 'email' = 'ludwintac@gmail.com');
CREATE POLICY "Admin ve todo subs" ON subscriptions FOR ALL USING (auth.jwt() ->> 'email' = 'ludwintac@gmail.com');
CREATE POLICY "Admin ve todo devices" ON devices FOR ALL USING (auth.jwt() ->> 'email' = 'ludwintac@gmail.com');
CREATE POLICY "Admin ve config" ON app_config FOR ALL USING (auth.jwt() ->> 'email' = 'ludwintac@gmail.com');

-- Configuración pública para lectura (regex)
CREATE POLICY "Config publica lectura" ON app_config FOR SELECT USING (true);
