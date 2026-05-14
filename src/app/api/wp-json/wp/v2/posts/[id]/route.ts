/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';
import { client } from '@/sanity/lib/client';
import { getCorsHeaders } from '../../utils';

const OLD_IMAGE_DOMAINS = [
  'chineseyiwu.com',
  'chineseyiwu.wordpress.com',
];

const CATEGORY_ID_MAP: Record<number, string> = {
  1: 'Market Insights',
  2: 'Industry News',
  3: 'Factory Tips',
  4: 'Product Guides',
};

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

async function replaceOldImageUrls(html: string): Promise<string> {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const replacements: { oldUrl: string; cleanFilename: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = imgRegex.exec(html)) !== null) {
    const oldUrl = match[1];
    const isOldDomain = OLD_IMAGE_DOMAINS.some(domain => oldUrl.includes(domain));
    if (!isOldDomain) continue;
    let filename = oldUrl.split('/').pop()?.split('?')[0] || '';
    filename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    // Strip WordPress dimension suffixes like -1024x768, -300x200, -150x150 before the extension
    const cleanFilename = filename.replace(/-\d+x\d+(?=\.\w+$)/, '');
    replacements.push({ oldUrl, cleanFilename });
  }

  if (replacements.length === 0) return html;

  // Collect unique clean filenames for batch query
  const uniqueFilenames = [...new Set(replacements.map(r => r.cleanFilename))];
  try {
    // Try exact originalFilename match first
    let assets: { originalFilename: string; url: string }[] = await client.fetch(
      `*[_type == "sanity.imageAsset" && originalFilename in $filenames] { originalFilename, url }`,
      { filenames: uniqueFilenames }
    );

    // For unmatched files, try broader filename matching
    const matchedOriginals = new Set(assets.map(a => a.originalFilename));
    const unmatched = uniqueFilenames.filter(f => !matchedOriginals.has(f));

    for (const filename of unmatched) {
      const baseName = filename.replace(/\.\w+$/, '');
      const fuzzy: { originalFilename: string; url: string }[] = await client.fetch(
        `*[_type == "sanity.imageAsset" && originalFilename match $pattern] | order(_createdAt desc)[0] { originalFilename, url }`,
        { pattern: `${baseName}*` }
      );
      if (fuzzy?.[0]) assets.push(fuzzy[0]);
    }

    const urlByFilename: Record<string, string> = {};
    for (const asset of assets) {
      urlByFilename[asset.originalFilename] = asset.url;
    }

    let result = html;
    for (const { oldUrl, cleanFilename } of replacements) {
      const newUrl = urlByFilename[cleanFilename] || urlByFilename[Object.keys(urlByFilename).find(k => k.includes(cleanFilename.replace(/\.\w+$/, ''))) || ''];
      if (newUrl) result = result.split(oldUrl).join(newUrl);
    }
    return result;
  } catch (e) {
    console.warn('Batch image URL replacement failed', e);
    return html;
  }
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
    const categoryIds: number[] = Array.isArray(categories) ? categories : [];
    const sanityCategory = categoryIds.length > 0
      ? (CATEGORY_ID_MAP[categoryIds[0]] || undefined)
      : undefined;

    // Tags: store as comma-separated string
    const tagIds: number[] = Array.isArray(tags) ? tags : [];
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

    // Replace old WordPress image URLs with Sanity CDN URLs
    const processedHtml = contentHtml ? await replaceOldImageUrls(contentHtml) : undefined;

    // Set publishedAt only when status === 'publish' and not already set
    const now = new Date().toISOString();

    if (existingDoc) {
      // Update existing document
      const patch = writeClient.patch(existingDoc._id);
      if (titleText) patch.set({ title: titleText });
      patch.set({ slug: { _type: 'slug', current: finalSlug } });
      if (processedHtml) patch.set({ htmlContent: processedHtml });
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
        htmlContent: processedHtml,
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
