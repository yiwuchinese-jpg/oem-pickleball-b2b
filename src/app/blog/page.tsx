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

export const revalidate = 60; // 缓存 60 秒

export default async function BlogPage() {
  try {
    const posts = await client.fetch(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      description,
      "coverUrl": mainImage.asset->url,
      publishedAt
    }`);

    return <BlogClient initialPosts={posts} />;
  } catch (error) {
    console.error('Sanity fetch failed during build', error);
    return <BlogClient initialPosts={[]} />;
  }
}
