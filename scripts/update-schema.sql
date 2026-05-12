-- 添加商品画廊和详情长图字段
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS detail_images JSONB DEFAULT '[]'::jsonb;
