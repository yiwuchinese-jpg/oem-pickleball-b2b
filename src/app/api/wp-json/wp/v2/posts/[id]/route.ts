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
    const post = await client.fetch(`*[_type == "post" && wordpressId == $id][0]{
      title, "slug": slug.current, htmlContent, description, category, tags,
      wordpressId, publishedAt, seoTitle, seoDescription,
      "featured_media": coalesce(mainImage.asset->wordpressMediaId, 0)
    }`, { id });

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

    const titleText = typeof body.title === 'object' ? body.title.rendered : (body.title || undefined);
    const contentHtml = typeof body.content === 'object' ? body.content.rendered : (body.content || undefined);
    const excerpt = typeof body.excerpt === 'object' ? body.excerpt.rendered : (body.excerpt || undefined);
    const { status, slug, featured_media, meta, categories, tags } = body;

    // Find the existing document in Sanity by the WordPress ID
    const existingDoc = await client.fetch(`*[_type == "post" && wordpressId == $id][0]`, { id });

    const finalSlug = slug || (titleText ? titleText.trim().toLowerCase()
      .replace(/[\u4e00-\u9fa5]/g, (c: string) => c.charCodeAt(0).toString(16))
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 80) : `post-${id}`);

    const seoTitle = meta?.rank_math_title || meta?.['_yoast_wpseo_title'] || meta?.['_aioseo_title'] || undefined;
    const seoDescription = meta?.rank_math_description || meta?.['_yoast_wpseo_metadesc'] || meta?.['_aioseo_description'] || undefined;

    // Map WordPress category IDs to Sanity category string
    let categoryIds: number[] = Array.isArray(categories) ? categories : [];
    // Auto-assign default category (Market Insights) if none provided
    if (categoryIds.length === 0) {
      categoryIds = [1];
    }
    const sanityCategory = findCategoryNameById(categoryIds[0]) || undefined;

    // Tags: store as comma-separated string
    let tagIds: number[] = Array.isArray(tags) ? tags : [];
    // Auto-assign default tags if none provided
    if (tagIds.length === 0) {
      tagIds = [1, 5];
    }
    // WP tags can come as [{id: 1, name: '...'}] or just [1, 2, 3]

    let mainImageRef = undefined;
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

    // Set publishedAt only when status === 'publish' and not already set
    const now = new Date().toISOString();

    if (existingDoc) {
      // Update existing document
      const patch = writeClient.patch(existingDoc._id);
      if (titleText) patch.set({ title: titleText });
      patch.set({ slug: { _type: 'slug', current: finalSlug } });
      if (contentHtml) patch.set({ htmlContent: contentHtml });
      if (excerpt || seoDescription) patch.set({ description: excerpt || seoDescription });
      if (seoTitle) patch.set({ seoTitle });
      if (seoDescription) patch.set({ seoDescription });
      if (mainImageRef) patch.set({ mainImage: mainImageRef });
      if (sanityCategory) patch.set({ category: sanityCategory });
      if (tagIds.length > 0) patch.set({ tags: tagIds.join(', ') });
      if (status === 'publish' && !existingDoc.publishedAt) {
        patch.set({ publishedAt: now });
      }
      
      await patch.commit();
    } else {
      // Create new document if it doesn't exist
      const sanityDoc: Record<string, unknown> = {
        _type: 'post',
        title: titleText || 'Untitled',
        slug: { _type: 'slug', current: finalSlug },
        htmlContent: contentHtml,
        description: excerpt || seoDescription,
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        wordpressId: id,
        publishedAt: status === 'publish' ? now : undefined,
      };
      if (mainImageRef) sanityDoc.mainImage = mainImageRef;
      if (sanityCategory) sanityDoc.category = sanityCategory;
      if (tagIds.length > 0) sanityDoc.tags = tagIds.join(', ');
      await writeClient.create(sanityDoc as any);
    }

    return NextResponse.json({
      id: parseInt(id),
      date: now,
      slug: finalSlug || id,
      status: status || 'publish',
      type: 'post',
      link: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${finalSlug || id}`,
      title: { rendered: titleText || '' },
      categories: categoryIds,
      tags: tagIds,
    }, { status: 200, headers: getCorsHeaders() });

  } catch (error: any) {
    console.error('Post update failed:', error);
    return NextResponse.json({ message: 'Post update failed', error: error?.message }, { status: 500, headers: getCorsHeaders() });
  }
}

// Evolution 301 might use PUT or PATCH to update posts
export { POST as PUT, POST as PATCH };
