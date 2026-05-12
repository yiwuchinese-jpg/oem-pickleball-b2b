-- Run this in Supabase SQL Editor to create the atomic stock deduction function

CREATE OR REPLACE FUNCTION decrement_stock(sku_id UUID, quantity_to_deduct INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Ensures the function runs with admin privileges, bypassing RLS if needed
AS $$
BEGIN
  -- 1. Security Check: Prevent malicious negative quantities from increasing stock
  IF quantity_to_deduct <= 0 THEN
    RAISE EXCEPTION 'Quantity to deduct must be greater than zero';
  END IF;

  -- 2. Atomic Update: Deduct stock only if there is enough stock available
  UPDATE product_skus
  SET stock_quantity = stock_quantity - quantity_to_deduct
  WHERE id = sku_id AND stock_quantity >= quantity_to_deduct;

  -- 3. Fail-safe: If no rows were updated, it means stock was insufficient (or SKU not found)
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for SKU %', sku_id;
  END IF;
END;
$$;
