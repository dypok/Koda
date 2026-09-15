-- ==============================================================================
-- KODA — FUNCIÓN ATÓMICA PARA OTORGAR XP (RNF-033: integridad absoluta)
-- Migración: 20260915000001_add_award_xp_function.sql
-- Motivo:
--   Los servicios de NestJS necesitan otorgar XP fuera del flujo de `attempts`
--   (ej. remediar un error del cuaderno, +5 XP). Insertar directamente en
--   xp_transactions desde el backend es inseguro (RLS solo permite SELECT a
--   los usuarios) y, hecho a mano en dos pasos, no es atómico ni idempotente
--   de forma segura ante llamadas concurrentes. Esta función resuelve ambos
--   problemas en una sola transacción, con lock de fila.
-- ==============================================================================

CREATE OR REPLACE FUNCTION fn_award_xp(
  p_user_id UUID,
  p_amount INT,
  p_reason VARCHAR(50),
  p_reference_id VARCHAR(128),
  p_reference_type VARCHAR(50),
  p_idempotency_key VARCHAR(128)
) RETURNS TABLE (balance_after INT, awarded BOOLEAN) AS $$
DECLARE
  v_current_xp INT;
  v_new_balance INT;
  v_existing_balance INT;
BEGIN
  -- Idempotencia: si ya se otorgó XP con esta clave, no duplicar.
  SELECT xp_transactions.balance_after INTO v_existing_balance
  FROM xp_transactions
  WHERE user_id = p_user_id AND idempotency_key = p_idempotency_key;

  IF FOUND THEN
    RETURN QUERY SELECT v_existing_balance, false;
    RETURN;
  END IF;

  SELECT total_xp INTO v_current_xp FROM users WHERE id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario % no encontrado', p_user_id;
  END IF;

  v_new_balance := v_current_xp + p_amount;

  UPDATE users SET total_xp = v_new_balance, updated_at = now() WHERE id = p_user_id;

  INSERT INTO xp_transactions (user_id, amount, balance_after, reason, reference_id, reference_type, idempotency_key)
  VALUES (p_user_id, p_amount, v_new_balance, p_reason, p_reference_id, p_reference_type, p_idempotency_key);

  RETURN QUERY SELECT v_new_balance, true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION fn_award_xp(UUID, INT, VARCHAR, VARCHAR, VARCHAR, VARCHAR) TO authenticated;
