import { MetadataRoute } from "next";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { client } from "@/sanity/lib/client";

const BASE_URL = "https://pickleoem.com";

// 动态生成 sitemap，自动包含 Sanity 中的所有博客文章
export const revalidate = 600; // 10 分钟缓存；发布时 /api/revalidate 会即时刷新 /sitemap.xml
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 静态页面（不写 lastModified：内容基本不变，new Date() 每次生成都变对 Google 是噪音信号）
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/oem`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/market`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/factory-tour`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/vr-tour`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 从 Supabase 动态获取所有上架产品详情页
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: products } = await supabase
      .from("products")
      .select("slug, created_at")
      .eq("is_active", true);

    productPages = (products || [])
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${BASE_URL}/products/${p.slug}`,
        lastModified: new Date(p.created_at || Date.now()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch (error) {
    // Supabase 连接失败时安全降级，不阻断构建
    console.warn("Sitemap: Supabase fetch failed, skipping product pages.", error);
  }

  // 从 Sanity 动态获取所有博客文章
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await client.fetch<{ slug: string; publishedAt?: string }[]>(
      `*[_type == "post" && defined(slug.current) && !(slug.current match "draft-*")] | order(publishedAt desc) {
        "slug": slug.current,
        publishedAt
      }`
    );

    blogPages = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    // Sanity 连接失败时安全降级，不阻断构建
    console.warn("Sitemap: Sanity fetch failed, using static pages only.", error);
  }

  return [...staticPages, ...productPages, ...blogPages];
}
