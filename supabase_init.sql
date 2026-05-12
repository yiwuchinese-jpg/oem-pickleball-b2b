-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Products Table (商品主表)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL, 
  title VARCHAR(255) NOT NULL, 
  description TEXT, 
  category VARCHAR(50), -- 'PADDLE' | 'BALL' | 'BUNDLE'
  tag VARCHAR(100),     -- e.g., 'Best Seller'
  badge VARCHAR(100),   -- e.g., 'USAPA Approved'
  specs JSONB,          -- Array of { label: string, value: string }
  moq VARCHAR(100),     -- e.g., 'MOQ 100 pcs'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public products viewable" ON products FOR SELECT USING (is_active = true);

-- 2. Product SKUs Table (SKU 变体表)
CREATE TABLE product_skus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku_code VARCHAR(100) UNIQUE NOT NULL, 
  attributes JSONB NOT NULL, -- e.g., {"color": "Red", "holes": 40}
  price_cents INTEGER NOT NULL, 
  stock_quantity INTEGER DEFAULT 0,
  weight_grams INTEGER DEFAULT 0, 
  image_url TEXT 
);
ALTER TABLE product_skus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public skus viewable" ON product_skus FOR SELECT USING (true);

-- 3. Orders Table (订单表)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paypal_order_id VARCHAR(100) UNIQUE,
  user_email VARCHAR(255) NOT NULL,
  shipping_address JSONB NOT NULL, 
  total_amount_cents INTEGER NOT NULL,
  shipping_fee_cents INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', 
  tracking_number VARCHAR(100), 
  erp_sync_status BOOLEAN DEFAULT FALSE, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- Only service role can read/write orders, no public policy needed.

-- 4. Order Items Table (订单明细表)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_sku_id UUID REFERENCES product_skus(id),
  quantity INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL
);
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
