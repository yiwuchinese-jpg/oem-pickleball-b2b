import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

const POSTS: Record<string, { title: string; description: string }> = {
  "how-to-find-oem-pickleball-factory": {
    title: "How to Find a Reliable OEM Pickleball Factory in China (2025 Guide)",
    description:
      "Most buyers waste months switching factories. Here's the exact checklist our 300+ global clients use to verify quality, MOQ, and DDP shipping before placing their first order.",
  },
  "philippines-pickleball-market-2025": {
    title: "Philippines Pickleball Market 2025: 18,000 Players, 277 Clubs & Where to Find Buyers",
    description:
      "The Philippines is Southeast Asia's fastest-growing pickleball market. We break down player demographics, club locations, and the wholesale opportunity for distributors right now.",
  },
  "roto-molded-vs-injection-molded-pickleball": {
    title: "Roto-Molded vs. Injection-Molded Pickleballs: Why It Matters for Your Brand",
    description:
      "The manufacturing method changes everything — bounce, durability, price, and USAPA compliance. Here's how to choose the right process for your OEM order.",
  },
};

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return {};
  return {
    title: `${post.title} | OEM Pickleball Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://pickleoem.com/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!POSTS[slug]) notFound();
  return <BlogPostClient slug={slug} />;
}
