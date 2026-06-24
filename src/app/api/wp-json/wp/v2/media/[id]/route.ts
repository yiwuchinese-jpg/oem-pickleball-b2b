/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';
import { client } from '@/sanity/lib/client';
import { getCorsHeaders, requireWpAuth } from '../../utils';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: getCorsHeaders() });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const asset = await client.fetch(`*[_type == "sanity.imageAsset" && wordpressMediaId == $id][0]{
      _id, url, originalFilename, title, altText, description, wordpressMediaId
    }`, { id });
    if (asset?._id) {
      const wpId = asset.wordpressMediaId ? parseInt(asset.wordpressMediaId) : parseInt(id);
      return NextResponse.json({
        id: wpId,
        date: new Date().toISOString(),
        slug: (asset.originalFilename || 'image').replace(/\.[^.]+$/, ''),
        status: 'inherit',
        type: 'attachment',
        source_url: asset.url,
        title: { rendered: asset.title || asset.originalFilename || '' },
        alt_text: asset.altText || '',
        description: { rendered: asset.description || '' },
      }, { status: 200, headers: getCorsHeaders() });
    }
  } catch (e) { console.warn('GET media lookup failed:', e); }

  return NextResponse.json({
    id: parseInt(id),
    date: new Date().toISOString(),
    status: 'inherit',
    type: 'attachment',
    title: { rendered: 'Media' },
  }, { status: 200, headers: getCorsHeaders() });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = requireWpAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const targetIdNum = parseInt(id);
    
    let altText = '';
    let titleText = '';
    let descriptionText = '';

    const clonedReq = request.clone();
    try {
      const jsonBody = await request.json();
      altText = jsonBody.alt_text || jsonBody.altText || '';
      descriptionText = jsonBody.description || jsonBody.caption || altText;
      titleText = typeof jsonBody.title === 'object' ? jsonBody.title.rendered : jsonBody.title;
    } catch (e) {
      try {
        const formData = await clonedReq.formData();
        altText = formData.get('alt_text') as string || '';
        descriptionText = formData.get('description') as string || formData.get('caption') as string || altText;
        titleText = formData.get('title') as string || '';
      } catch (err) {}
    }

    let targetSanityId = null;

    // 优先：直接用 wordpressMediaId 精准查找（新机制）
    const byMediaId = await client.fetch(`*[_type == "sanity.imageAsset" && wordpressMediaId == $id][0] { _id }`, { id });
    if (byMediaId?._id) {
      targetSanityId = byMediaId._id;
    }

    // 第二层：兼容老版本用 title 存储的 ID
    if (!targetSanityId) {
      const existingDoc = await client.fetch(`*[_type == "sanity.imageAsset" && title == $id][0] { _id }`, { id });
      if (existingDoc?._id) targetSanityId = existingDoc._id;
    }

    // 第三层：hashString(_id) 兜底
    if (!targetSanityId) {
      const recentAssets = await client.fetch(`*[_type == "sanity.imageAsset"] | order(_createdAt desc)[0...200] { _id }`);
      for (const asset of recentAssets) {
        if (hashString(asset._id) === targetIdNum) {
          targetSanityId = asset._id;
          break;
        }
      }
    }

    if (targetSanityId) {
      const patch = writeClient.patch(targetSanityId);
      if (altText) patch.set({ altText: altText });
      if (descriptionText) patch.set({ description: descriptionText });
      if (titleText) patch.set({ title: titleText, originalFilename: titleText });
      await patch.commit();
    } else {
       console.warn(`[Media Update API] Could not find Sanity asset matching ID ${id} via title or hash`);
    }

    return NextResponse.json({
      id: targetIdNum,
      date: new Date().toISOString(),
      status: 'inherit',
      type: 'attachment',
      title: { rendered: titleText || id },
      alt_text: altText || '',
      description: { rendered: descriptionText || '' }
    }, { status: 200, headers: getCorsHeaders() });

  } catch (error: any) {
    console.error("[Media Update API] Error: ", error);
    return NextResponse.json({ message: 'Update failed', error: error.message }, { status: 500, headers: getCorsHeaders() });
  }
}

export { POST as PUT, POST as PATCH };
