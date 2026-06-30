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

export const revalidate = 600; // ISR：缓存 10 分钟（页面秒开），每 10 分钟同步 Sanity 新内容

export default async function BlogPage() {
  let posts = [];
  try {
    // 撤销 defined(htmlContent) 过滤条件，恢复正常显示
    posts = await client.fetch(`*[_type == "post" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      description,
      category,
      "coverUrl": mainImage.asset->url,
      publishedAt,
      _createdAt
    }`);
  } catch (error) {
    console.error('Sanity fetch failed during build', error);
  }
  
  return (
    <>
      <BlogClient initialPosts={posts} />
      {/* SSR crawlable archive — the visual list above is client-paginated (6 per page,
          JS buttons), so without this only page 1 is in the server HTML and the rest are
          orphaned. This renders a real <a> link to every article so crawlers can reach
          and index all of them from /blog. */}
      <nav
        aria-label="All articles"
        className="max-w-6xl mx-auto px-5 md:px-8 mt-20 pt-10 border-t border-white/10"
      >
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-5">
          All articles
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-none p-0 m-0">
          {posts.map((p: { slug: string; title: string }) => (
            <li key={p.slug} className="leading-snug">
              <a
                href={`/blog/${p.slug}`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {p.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
