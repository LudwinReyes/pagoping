-- Función RPC para registrar pagos desde la App Android
-- Se usa desde PaymentRepository.kt -> registerPayment

CREATE OR REPLACE FUNCTION registrar_pago(
    device_id TEXT,
    sender_name TEXT,
    amount DECIMAL,
    operation_code TEXT,
    raw_message TEXT,
    notification_hash TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_payment_id UUID;
    current_user_id UUID;
BEGIN
    -- 1. Obtener ID del usuario actual
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'No autenticado'
        );
    END IF;

    -- 2. Intentar insertar el pago
    BEGIN
        INSERT INTO public.payments (
            user_id,
            device_id,
            sender_name,
            amount,
            operation_code,
            raw_message,
            notification_hash
        ) VALUES (
            current_user_id,
            device_id,
            sender_name,
            amount,
            operation_code,
            raw_message,
            notification_hash
        )
        RETURNING id INTO new_payment_id;

        -- 3. Retornar éxito
        RETURN jsonb_build_object(
            'success', true,
            'payment_id', new_payment_id
        );

    EXCEPTION 
        -- Capturar error de duplicados (unique_payment_per_user)
        WHEN unique_violation THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Pago duplicado'
            );
        -- Capturar errores de validación (guard_payment_insertion trigger)
        WHEN raise_exception THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', SQLERRM
            );
        WHEN OTHERS THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', SQLERRM
            );
    END;
END;
$$;
