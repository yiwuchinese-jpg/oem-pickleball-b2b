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
  const coverUrl = post.coverUrl || '/og-image.jpg';

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: {
      canonical: `https://pickleoem.com/blog/${slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      type: "article",
      url: `https://pickleoem.com/blog/${slug}`,
      images: [{ url: coverUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      images: [coverUrl],
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

  // Article JSON-LD 结构化数据
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description || '',
    image: post.coverUrl || 'https://pickleoem.com/og-image.jpg',
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "OEM Pickleball Factory",
      url: "https://pickleoem.com",
    },
    publisher: {
      "@type": "Organization",
      name: "OEM Pickleball Factory",
      logo: {
        "@type": "ImageObject",
        url: "https://pickleoem.com/og-image.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://pickleoem.com/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogPostClient post={post} />
    </>
  );
}
