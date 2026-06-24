/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { getCorsHeaders, requireWpAuth } from '../utils';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: getCorsHeaders() });
}

// Evolution 301 通过 POST /posts/{id} 创建和更新文档（createIfNotExists 幂等）
// 此路由只用于 GET /posts 列表查询，POST 改为返回占位响应避免重复文档
export async function POST(request: Request) {
  try {
    const authError = requireWpAuth(request);
    if (authError) return authError;

    const body = await request.json().catch(() => ({}));
    const titleText = typeof body.title === 'object' ? body.title.rendered : (body.title || 'Untitled Draft');
    const { slug } = body;

    // Generate a clean slug from title (not draft-xxx which pollutes Sanity)
    const finalSlug = slug || titleText.trim().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 80) || `post-${Date.now().toString(36)}`;

    // Generate a WordPress compatible, smaller random integer ID
    const wpCompatibleId = Math.floor(Math.random() * 1_000_000_000);

    return NextResponse.json({
      id: wpCompatibleId,
      date: new Date().toISOString(),
      slug: finalSlug,
      status: 'draft',
      type: 'post',
      link: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${finalSlug}`,
      title: { rendered: titleText },
    }, { status: 201, headers: getCorsHeaders() });

  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to create draft', error: error.message }, { status: 500, headers: getCorsHeaders() });
  }
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
    const mappedPosts = posts.map((post: any, index: number) => {
      const slugVal = post.slug?.current || '';
      const isDraft = slugVal.startsWith('draft-') || !post.publishedAt;
      return {
        id: post.wordpressId ? parseInt(post.wordpressId) : (index + 1),
        date: post.publishedAt || new Date().toISOString(),
        slug: slugVal,
        status: isDraft ? 'draft' : 'publish',
        type: 'post',
        link: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pickleoem.com'}/blog/${slugVal}`,
        title: { rendered: post.title || 'Untitled' },
        excerpt: { rendered: post.description || '' },
      };
    });

    return NextResponse.json(mappedPosts, { status: 200, headers: getCorsHeaders() });
  } catch (error) {
    return NextResponse.json([], { status: 200, headers: getCorsHeaders() });
  }
}
