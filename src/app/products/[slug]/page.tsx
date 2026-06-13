import { notFound } from 'next/navigation';

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
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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
    alternates: {
      canonical: `https://pickleoem.com/products/${slug}`,
    },
    openGraph: {
      title: product.title,
      description: product.description || '',
      url: `https://pickleoem.com/products/${slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description || '',
      images: [imageUrl],
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

  // Product JSON-LD 结构化数据（让 Google 展示价格、库存等富媒体结果）
  const skus = product.product_skus || [];
  const prices = skus
    .map((s: { price_cents?: number }) => s.price_cents)
    .filter((c: number | undefined): c is number => typeof c === "number" && c > 0);
  const lowPrice = prices.length ? Math.min(...prices) / 100 : undefined;
  const highPrice = prices.length ? Math.max(...prices) / 100 : undefined;
  const totalStock = skus.reduce(
    (sum: number, s: { stock_quantity?: number }) => sum + (s.stock_quantity || 0),
    0
  );
  const productImage =
    product.gallery_images?.[0] || skus[0]?.image_url || "https://pickleoem.com/og-image.jpg";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || "Premium pickleball equipment direct from factory.",
    image: productImage,
    sku: skus[0]?.sku_code,
    brand: {
      "@type": "Brand",
      name: "DJW Pickleball Factory",
    },
    ...(lowPrice !== undefined && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: lowPrice.toFixed(2),
        highPrice: (highPrice ?? lowPrice).toFixed(2),
        offerCount: skus.length,
        availability:
          totalStock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: `https://pickleoem.com/products/${slug}`,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}