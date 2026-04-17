import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { writeClient } from '@/sanity/lib/write-client';
import { getCorsHeaders } from '../utils';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: getCorsHeaders() });
}

// Evolution 301 先调用 POST /posts 创建草稿，拿到 ID，再调用 POST /posts/{id} 写内容
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const titleText = typeof body.title === 'object' ? body.title.rendered : (body.title || 'Untitled Draft');
    const { status, slug } = body;

    const finalSlug = slug || `draft-${Date.now()}`;

    // 在 Sanity 创建草稿文档
    const sanityDoc = {
      _type: 'post',
      title: titleText,
      slug: { _type: 'slug', current: finalSlug },
      publishedAt: new Date().toISOString(),
    };
    const created = await writeClient.create(sanityDoc);

    // 用 Sanity 文档 ID 的 hash 生成一个稳定的数字 ID
    const numericId = Math.abs(created._id.split('').reduce((acc: number, c: string) => acc * 31 + c.charCodeAt(0), 0) % 2147483647) || Date.now();

    // 把数字 ID 回写到文档，供后续步骤查询
    await writeClient.patch(created._id).set({ wordpressId: numericId.toString() }).commit();

    return NextResponse.json({
      id: numericId,
      date: new Date().toISOString(),
      slug: finalSlug,
      status: status || 'draft',
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
