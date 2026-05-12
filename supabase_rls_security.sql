-- Run this in Supabase SQL Editor to secure user_addresses and orders

-- 1. Secure user_addresses table
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own addresses
CREATE POLICY "Users can view their own addresses" 
ON user_addresses FOR SELECT 
USING (auth.email() = user_email);

-- Allow users to insert their own addresses
CREATE POLICY "Users can insert their own addresses" 
ON user_addresses FOR INSERT 
WITH CHECK (auth.email() = user_email);

-- Allow users to update their own addresses
CREATE POLICY "Users can update their own addresses" 
ON user_addresses FOR UPDATE 
USING (auth.email() = user_email);

-- Allow users to delete their own addresses
CREATE POLICY "Users can delete their own addresses" 
ON user_addresses FOR DELETE 
USING (auth.email() = user_email);

-- 2. Secure orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own orders
CREATE POLICY "Users can view their own orders" 
ON orders FOR SELECT 
USING (auth.email() = user_email OR auth.email() = customer_email);

-- 3. Secure order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own order items
CREATE POLICY "Users can view their own order items" 
ON order_items FOR SELECT 
USING (
  order_id IN (
    SELECT id FROM orders 
    WHERE auth.email() = user_email OR auth.email() = customer_email
  )
);
