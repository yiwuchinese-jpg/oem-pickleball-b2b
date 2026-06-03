/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';
import { client } from '@/sanity/lib/client';
import { getCorsHeaders, findCategoryNameById } from '../../utils';

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: getCorsHeaders() });
}

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  try {
    let post = await client.fetch(`*[_type == "post" && wordpressId == $id][0]{
      title, "slug": slug.current, htmlContent, description, category, tags,
      wordpressId, publishedAt, seoTitle, seoDescription,
      "featured_media": coalesce(mainImage.asset->wordpressMediaId, 0)
    }`, { id });

    if (!post) {
      // Try by deterministic _id as fallback
      post = await client.fetch(`*[_id == $docId][0]{
        title, "slug": slug.current, htmlContent, description, category, tags,
        wordpressId, publishedAt, seoTitle, seoDescription,
        "featured_media": coalesce(mainImage.asset->wordpressMediaId, 0)
      }`, { docId: `wp-post-${id}` });
    }

    if (post) {
      const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      return NextResponse.json({
        id: post.wordpressId ? parseInt(post.wordpressId) : parseInt(id),
        date: post.publishedAt || new Date().toISOString(),
        slug: post.slug,
        status: post.publishedAt ? 'publish' : 'draft',
        type: 'post',
        link: `${SITE_URL}/blog/${post.slug}`,
        title: { rendered: post.title || '' },
        content: { rendered: post.htmlContent || '' },
        excerpt: { rendered: post.description || '' },
        featured_media: post.featured_media || 0,
        categories: post.category ? [post.category] : [],
        tags: post.tags ? post.tags.split(',').map((t: string) => t.trim()) : [],
      }, { status: 200, headers: getCorsHeaders() });
    }
  } catch (e) {
    console.warn('GET post lookup failed, returning placeholder:', e);
  }

  return NextResponse.json({
    id: parseInt(id),
    date: new Date().toISOString(),
    slug: `post-${id}`,
    status: 'draft',
    type: 'post',
    link: '',
    title: { rendered: '' },
    content: { rendered: '' },
    excerpt: { rendered: '' },
    featured_media: 0,
    categories: [],
    tags: [],
  }, { status: 200, headers: getCorsHeaders() });
}

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();

    const titleText: string | undefined = (body.title?.rendered || body.title) || undefined;
    const contentRaw = body.content;
    // 301 sends content as a raw HTML string, not as {rendered: "..."}
    const contentHtml: string | undefined =
      typeof contentRaw === 'string' ? contentRaw
      : contentRaw?.rendered ? contentRaw.rendered
      : undefined;
    const excerpt: string | undefined = (body.excerpt?.rendered || body.excerpt) || undefined;
    const { status, slug, featured_media, meta, categories, tags } = body;

    // Deterministic Sanity _id based on WP id to prevent race-condition duplicates
    const docId = `wp-post-${id}`;

    // Determine if the document needs to be created or already exists
    let docExists = false;
    try {
      const existing = await client.fetch(`count(*[_id == $docId])`, { docId });
      docExists = existing > 0;
    } catch {
      // If lookup fails, assume it doesn't exist
    }

    if (!docExists) {
      try {
        await writeClient.create({
          _id: docId,
          _type: 'post',
          wordpressId: id,
          title: titleText || 'Untitled',
          slug: { _type: 'slug', current: slug || `post-${id}` },
        } as any);
      } catch (e: any) {
        // If create fails because doc already exists (race), that's OK
        if (!String(e.message).includes('already exists') && !String(e.message).includes('conflict')) {
          throw e;
        }
      }
    }

    const finalSlug = slug || (titleText ? titleText.trim().toLowerCase()
      .replace(/[\u4e00-\u9fa5]/g, (c: string) => c.charCodeAt(0).toString(16))
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 80) : `post-${id}`);

    const seoTitle: string | undefined = meta?.rank_math_title || meta?.['_yoast_wpseo_title'] || meta?.['_aioseo_title'] || undefined;
    const seoDescription: string | undefined = meta?.rank_math_description || meta?.['_yoast_wpseo_metadesc'] || meta?.['_aioseo_description'] || undefined;

    // Map WordPress category IDs to Sanity category string
    const categoryIds: number[] = Array.isArray(categories) ? categories : (categories ? [categories] : [1]);
    const sanityCategory = findCategoryNameById(categoryIds[0]) || undefined;

    // Tags: store as comma-separated string
    const tagIds: number[] = Array.isArray(tags) ? tags : (tags ? [tags] : [1, 5]);

    // Featured image lookup
    let mainImageRef: { _type: string; asset: { _type: string; _ref: string } } | undefined;
    if (featured_media && featured_media > 0) {
      try {
        const matchedAsset = await client.fetch(
          `*[_type == "sanity.imageAsset" && wordpressMediaId == $mediaId][0] { _id }`,
          { mediaId: featured_media.toString() }
        );
        if (matchedAsset?._id) {
          mainImageRef = { _type: 'image', asset: { _type: 'reference', _ref: matchedAsset._id } };
        }
      } catch (e) {
        console.warn('Cover image lookup failed', e);
      }
    }

    // Build patch with all updated fields
    const patch = writeClient.patch(docId);
    if (titleText) patch.set({ title: titleText });
    if (contentHtml) patch.set({ htmlContent: contentHtml });
    if (excerpt || seoDescription) patch.set({ description: excerpt || seoDescription });
    if (seoTitle) patch.set({ seoTitle });
    if (seoDescription) patch.set({ seoDescription });
    if (mainImageRef) {
      patch.set({ mainImage: mainImageRef });
    } else if (typeof featured_media === 'number' && featured_media === 0) {
      // 301 explicitly sent featured_media=0. Do not unset,
      // allow existing mainImage to persist if previously set.
    }
    if (sanityCategory) patch.set({ category: sanityCategory });
    if (tagIds.length > 0) patch.set({ tags: tagIds.map(t => typeof t === 'object' ? (t as any).name : t).filter(Boolean).join(', ') });

    // Set slug only if the body provides one
    if (slug) patch.set({ slug: { _type: 'slug', current: finalSlug } });

    // Set publishedAt when status === 'publish'
    const now = new Date().toISOString();
    if (status === 'publish') {
      const current = await client.fetch(`*[_id == $id][0].publishedAt`, { id: docId });
      if (!current) patch.set({ publishedAt: now });
    }

    await patch.commit();

    return NextResponse.json({
      id: parseInt(id),
      date: now,
      slug: finalSlug,
      status: status || 'publish',
      type: 'post',
      link: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${finalSlug}`,
      title: { rendered: titleText || '' },
      categories: categoryIds,
      tags: tagIds,
    }, { status: 200, headers: getCorsHeaders() });

  } catch (error: any) {
    const detail = error?.response?.body || error?.details || error?.message || String(error);
    console.error('Post update failed:', JSON.stringify({
      docId: `wp-post-${error instanceof Error ? '' : ''}`,
      message: error?.message,
      statusCode: error?.statusCode,
      body: error?.response?.body,
    }));
    return NextResponse.json({
      code: 'wp_api_error',
      message: 'Post update failed',
      error: typeof detail === 'string' ? detail.substring(0, 500) : JSON.stringify(detail).substring(0, 500),
    }, { status: 500, headers: getCorsHeaders() });
  }
}

// Evolution 301 might use PUT or PATCH to update posts
export { POST as PUT, POST as PATCH };
