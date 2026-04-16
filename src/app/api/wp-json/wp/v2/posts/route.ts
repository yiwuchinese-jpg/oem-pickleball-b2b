import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { getCorsHeaders } from '../utils';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: getCorsHeaders() });
}

export async function GET() {
  try {
    // Fetch all posts from Sanity
    const posts = await client.fetch(`*[_type == "post" && defined(slug.current)] {
      title,
      slug,
      publishedAt,
      wordpressId,
      description
    }`);

    // Map to WP REST API format for Evolution 301 Internal Linking
    const mappedPosts = posts.map((post: any, index: number) => ({
      id: post.wordpressId ? parseInt(post.wordpressId) : (index + 1),
      date: post.publishedAt || new Date().toISOString(),
      slug: post.slug.current,
      status: 'publish',
      type: 'post',
      link: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pickleoem.com'}/blog/${post.slug.current}`,
      title: { rendered: post.title || 'Untitled' },
      excerpt: { rendered: post.description || '' },
    }));

    return NextResponse.json(mappedPosts, { status: 200, headers: getCorsHeaders() });
  } catch (error) {
    return NextResponse.json([], { status: 200, headers: getCorsHeaders() });
  }
}
