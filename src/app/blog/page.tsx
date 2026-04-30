import type { Metadata } from "next";
import BlogClient from "./BlogClient";
import { client } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "Pickleball OEM Blog | Factory Tips, Market Insights & How-To Guides",
  description:
    "Expert guides on finding OEM pickleball manufacturers, Southeast Asia market data, and quality verification tips for wholesale buyers.",
  alternates: {
    canonical: "https://pickleoem.com/blog",
  },
  openGraph: {
    title: "Pickleball OEM Blog | Factory Tips & Market Insights",
    description: "Expert guides for pickleball wholesale buyers.",
    url: "https://pickleoem.com/blog",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Pickleball OEM Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pickleball OEM Blog | Factory Tips & Market Insights",
    description: "Expert guides for pickleball wholesale buyers.",
    images: ["/og-image.jpg"],
  },
};

export const revalidate = 0; // 实时同步 CMS 缓存

export default async function BlogPage() {
  try {
    // 过滤条件：1. 必须是 post 2. slug 存在 3. slug 不是草稿 4. htmlContent (正文) 必须有内容
    const posts = await client.fetch(`*[_type == "post" && defined(slug.current) && !(slug.current match "draft-*") && defined(htmlContent)] | order(_createdAt desc) {
      title,
      "slug": slug.current,
      description,
      category,
      "coverUrl": mainImage.asset->url,
      publishedAt,
      _createdAt
    }`);

    return <BlogClient initialPosts={posts} />;
  } catch (error) {
    console.error('Sanity fetch failed during build', error);
    return <BlogClient initialPosts={[]} />;
  }
}
