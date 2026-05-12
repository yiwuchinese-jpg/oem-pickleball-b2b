-- Allow users to update their own orders (e.g., cancel)
CREATE POLICY "Users can update their own orders"
ON orders FOR UPDATE
USING (auth.email() = user_email);

-- Allow users to delete their own orders
CREATE POLICY "Users can delete their own orders"
ON orders FOR DELETE
USING (auth.email() = user_email);

-- Admin can manage all orders
CREATE POLICY "Admins can update all orders"
ON orders FOR UPDATE
USING (auth.email() = 'buydiscoball@gmail.com');

CREATE POLICY "Admins can delete all orders"
ON orders FOR DELETE
USING (auth.email() = 'buydiscoball@gmail.com');
