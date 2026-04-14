import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";
import { client } from "@/sanity/lib/client";

export const revalidate = 60; // 缓存 60 秒

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(`*[_type == "post" && defined(slug.current)][].slug.current`);
    return slugs.map((slug: string) => ({ slug }));
  } catch (error) {
    console.error('Sanity connection failed during build, safe fallback.', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let post = null;
  try {
    post = await client.fetch(`*[_type == "post" && slug.current == $slug][0] {
      seoTitle,
      title,
      seoDescription,
      description,
      "coverUrl": mainImage.asset->url
    }`, { slug });
  } catch (e) {}

  if (!post) return {};
  
  const metaTitle = post.seoTitle || post.title || 'OEM Pickleball Blog';
  const metaDesc = post.seoDescription || post.description || '';

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      type: "article",
      images: post.coverUrl ? [{ url: post.coverUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      images: post.coverUrl ? [post.coverUrl] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post = null;
  
  try {
    post = await client.fetch(`*[_type == "post" && slug.current == $slug][0] {
      title,
      htmlContent,
      description,
      "coverUrl": mainImage.asset->url,
      publishedAt
    }`, { slug });
  } catch(e) {}

  if (!post) notFound();
  return <BlogPostClient post={post} />;
}
