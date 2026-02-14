-- Sincronizar datos de ludwinrey.s@gmail.com
DO $$
DECLARE
  user_id_var UUID;
BEGIN
  -- Obtener el ID del usuario ludwinrey.s@gmail.com
  SELECT id INTO user_id_var FROM auth.users WHERE email = 'ludwinrey.s@gmail.com';
  
  IF user_id_var IS NOT NULL THEN
    -- Insertar o actualizar suscripción
    INSERT INTO subscriptions (user_id, email, tier, max_validations, max_devices, can_export, is_active, validations_count)
    VALUES (user_id_var, 'ludwinrey.s@gmail.com', 'basic', 999, 5, false, true, 3)
    ON CONFLICT (user_id) DO UPDATE SET
      tier = 'basic',
      max_validations = 999,
      max_devices = 5,
      can_export = false,
      is_active = true,
      validations_count = 3;
    
    -- Insertar dispositivo
    INSERT INTO devices (device_id, user_id, device_name)
    VALUES ('device_ludwinrey_001', user_id_var, 'Mi Teléfono')
    ON CONFLICT (device_id) DO NOTHING;
    
    -- Insertar pagos de prueba
    INSERT INTO payments (user_id, device_id, sender_name, amount, operation_code, notification_hash, raw_message)
    VALUES 
      (user_id_var, 'device_ludwinrey_001', 'Juan Pérez', 150.50, 'OP001', 'hash_001', 'Pago de prueba 1'),
      (user_id_var, 'device_ludwinrey_001', 'María García', 300.00, 'OP002', 'hash_002', 'Pago de prueba 2'),
      (user_id_var, 'device_ludwinrey_001', 'Carlos López', 75.25, 'OP003', 'hash_003', 'Pago de prueba 3')
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Datos sincronizados para ludwinrey.s@gmail.com';
  ELSE
    RAISE WARNING 'Usuario ludwinrey.s@gmail.com no encontrado en auth.users';
  END IF;
END $$;
