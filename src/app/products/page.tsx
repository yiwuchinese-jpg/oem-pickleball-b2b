import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Buy Pickleball Paddles & Balls Online | DJW Factory Direct',
  description:
    'Shop premium USAPA-approved pickleball paddles and balls direct from the DJW factory. T700/T800 carbon fiber paddles, rotational-molded balls, bundle sets. Free shipping available. Order online today.',
  alternates: {
    canonical: 'https://pickleoem.com/products',
  },
  openGraph: {
    title: 'Buy Pickleball Paddles & Balls | DJW Factory Store',
    description:
      'Premium pickleball equipment direct from factory. USAPA approved. T700/T800 carbon paddles, outdoor & indoor balls. Shop now.',
    url: 'https://pickleoem.com/products',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  keywords: [
    'buy pickleball paddle',
    'pickleball paddle online',
    'USAPA approved paddle',
    'carbon fiber pickleball paddle',
    'pickleball balls for sale',
    'factory direct pickleball',
    'T700 pickleball paddle',
    'cheap pickleball equipment',
    'pickleball bundle set',
  ],
};

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// 缓存 1 小时（产品和价格不会频繁变化）
export const revalidate = 3600;

export default async function ProductsPage() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 只取产品卡片需要的字段，减少数据传输量，加快响应
  const { data: products } = await supabase
    .from('products')
    .select(`
      id, title, slug, category, tag, badge, gallery_images, description, created_at,
      product_skus (id, price_cents, stock_quantity, image_url)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  return <ProductsClient initialProducts={(products as any) || []} />;
}
