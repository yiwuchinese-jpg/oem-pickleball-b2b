-- Run this in Supabase SQL Editor to create an atomic stock deduction function
CREATE OR REPLACE FUNCTION decrement_stock(sku_id UUID, quantity_to_deduct INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE product_skus
  SET stock_quantity = GREATEST(0, stock_quantity - quantity_to_deduct)
  WHERE id = sku_id;
END;
$$;