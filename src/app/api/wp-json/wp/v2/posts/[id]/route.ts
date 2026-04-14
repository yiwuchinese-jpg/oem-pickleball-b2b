import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';
import { client } from '@/sanity/lib/client';
import { getCorsHeaders } from '../../utils';

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: getCorsHeaders() });
}

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  return NextResponse.json({
    id: parseInt(id),
    date: new Date().toISOString(),
    status: 'draft',
    type: 'post',
    title: { rendered: 'Draft Article' },
    content: { rendered: '' }
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
    const { status, slug, featured_media, meta } = body;

    // Find the existing document in Sanity by the WordPress ID
    const existingDoc = await client.fetch(`*[_type == "post" && wordpressId == $id][0]`, { id });

    const finalSlug = slug || (titleText ? titleText.trim().toLowerCase()
      .replace(/[\u4e00-\u9fa5]/g, (c: string) => c.charCodeAt(0).toString(16))
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 80) : undefined);

    const seoTitle = meta?.rank_math_title || meta?.['_yoast_wpseo_title'] || meta?.['_aioseo_title'] || undefined;
    const seoDescription = meta?.rank_math_description || meta?.['_yoast_wpseo_metadesc'] || meta?.['_aioseo_description'] || undefined;

    let mainImageRef = undefined;
    if (featured_media && featured_media > 0) {
      try {
        const latestAsset = await client.fetch(`*[_type == "sanity.imageAsset"] | order(_createdAt desc)[0] { _id }`);
        if (latestAsset?._id) {
          mainImageRef = { _type: 'image', asset: { _type: 'reference', _ref: latestAsset._id } };
        }
      } catch (e) {
        console.warn('Cover image lookup failed', e);
      }
    }

    if (existingDoc) {
      // Update existing document
      const patch = writeClient.patch(existingDoc._id);
      if (titleText) patch.set({ title: titleText });
      if (finalSlug) patch.set({ slug: { _type: 'slug', current: finalSlug } });
      if (contentHtml) patch.set({ htmlContent: contentHtml });
      if (excerpt || seoDescription) patch.set({ description: excerpt || seoDescription });
      if (seoTitle) patch.set({ seoTitle });
      if (seoDescription) patch.set({ seoDescription });
      if (mainImageRef) patch.set({ mainImage: mainImageRef });
      
      await patch.commit();
    } else {
      // Create new document if it doesn't exist
      const sanityDoc = {
        _type: 'post',
        title: titleText || 'Untitled',
        slug: finalSlug ? { _type: 'slug', current: finalSlug } : undefined,
        htmlContent: contentHtml,
        description: excerpt || seoDescription,
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        wordpressId: id,
        publishedAt: new Date().toISOString(),
        ...(mainImageRef ? { mainImage: mainImageRef } : {}),
      };
      await writeClient.create(sanityDoc);
    }

    return NextResponse.json({
      id: parseInt(id),
      date: new Date().toISOString(),
      slug: finalSlug || id,
      status: status || 'publish',
      type: 'post',
      link: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${finalSlug || id}`,
      title: { rendered: titleText || '' },
    }, { status: 200, headers: getCorsHeaders() });

  } catch (error) {
    return NextResponse.json({ message: 'Post update failed' }, { status: 500, headers: getCorsHeaders() });
  }
}

// Evolution 301 might use PUT or PATCH to update posts
export { POST as PUT, POST as PATCH };
