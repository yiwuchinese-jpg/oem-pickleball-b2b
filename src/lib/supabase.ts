import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 前端公共客户端（受 RLS 策略约束）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 服务端高权限客户端（仅在 API Routes 中使用，不暴露至前端）
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ─── Database Types ───────────────────────────────────────────────────────────
export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: 'PADDLE' | 'BALL' | 'BUNDLE';
  tag: string | null;
  badge: string | null;
  specs: { label: string; value: string }[];
  moq: string | null;     // 保留用于 OEM/B2B 展示
  is_active: boolean;
  created_at: string;
  gallery_images?: string[];
  detail_images?: string[];
}

export interface ProductSku {
  id: string;
  product_id: string;
  sku_code: string;
  attributes: Record<string, string>; // 例如: {"color": "Red", "holes": "40"}
  price_cents: number;
  stock_quantity: number;
  weight_grams: number;
  image_url: string | null;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'cancelled';

export interface Order {
  id: string;
  paypal_order_id: string | null;
  user_email: string;
  shipping_address: ShippingAddress;
  total_amount_cents: number;
  shipping_fee_cents: number;
  status: OrderStatus;
  tracking_number: string | null;
  erp_sync_status: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_sku_id: string;
  quantity: number;
  unit_price_cents: number;
  product_sku?: ProductSku;
}

export interface ShippingAddress {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address_line1: string;
  address_line2?: string;
  postal_code: string;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  sku: ProductSku;
  quantity: number;
}
