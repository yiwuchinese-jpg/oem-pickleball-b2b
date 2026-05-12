import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata } from 'next';
import { cache } from 'react';

export const revalidate = 3600; // Cache for 1 hour

// Generate static params for all active products to enable instant page loads
export async function generateStaticParams() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: products } = await supabase
    .from('products')
    .select('slug')
    .eq('is_active', true);
    
  return (products || []).map((product) => ({
    slug: product.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Memoize the database fetch so generateMetadata and the page don't make duplicate queries
const getProduct = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*, product_skus(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  return product;
});

// Fetch related products (excluding current product, max 3)
const getRelatedProducts = cache(async (currentSlug: string) => {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('id, title, slug, gallery_images, product_skus(price_cents, image_url)')
    .eq('is_active', true)
    .neq('slug', currentSlug)
    .limit(3);
  return products || [];
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const imageUrl = product.gallery_images?.[0] || product.product_skus?.[0]?.image_url || '/og-image.jpg';

  return {
    title: `${product.title} | DJW Pickleball Factory`,
    description: product.description || 'Premium pickleball equipment direct from factory.',
    openGraph: {
      title: product.title,
      description: product.description || '',
      images: [{ url: imageUrl }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, relatedProducts] = await Promise.all([
    getProduct(slug),
    getRelatedProducts(slug),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}