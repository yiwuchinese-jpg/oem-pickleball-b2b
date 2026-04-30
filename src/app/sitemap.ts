import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

const BASE_URL = "https://pickleoem.com";

// 动态生成 sitemap，自动包含 Sanity 中的所有博客文章
export const revalidate = 0; // 实时同步 CMS 缓存
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/oem`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/market`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // 从 Sanity 动态获取所有博客文章
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await client.fetch<{ slug: string; publishedAt?: string }[]>(
      `*[_type == "post" && defined(slug.current) && !(slug.current match "draft-*") && defined(htmlContent)] | order(publishedAt desc) {
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

  return [...staticPages, ...blogPages];
}
