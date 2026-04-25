import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';
import { client } from '@/sanity/lib/client';
import { getCorsHeaders } from '../../utils';

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
    const { id } = await params;
    const targetIdNum = parseInt(id);
    
    let altText = '';
    let titleText = '';
    let rawBodyDump = '';

    // 暴力解析所有的可能性，以便知道它到底发了什么
    const clonedReq = request.clone();
    try {
      const jsonBody = await request.json();
      altText = jsonBody.alt_text || jsonBody.altText || jsonBody.description || '';
      titleText = typeof jsonBody.title === 'object' ? jsonBody.title.rendered : jsonBody.title;
      rawBodyDump = JSON.stringify(jsonBody);
    } catch (e) {
      try {
        const formData = await clonedReq.formData();
        altText = formData.get('alt_text') as string || formData.get('description') as string || '';
        titleText = formData.get('title') as string || '';
        const formObj: any = {};
        formData.forEach((value, key) => { formObj[key] = value });
        rawBodyDump = JSON.stringify(formObj);
      } catch (err) {
        rawBodyDump = "Could not parse body";
      }
    }

    const recentAssets = await client.fetch(`*[_type == "sanity.imageAsset"] | order(_createdAt desc)[0...200] { _id }`);
    let targetSanityId = null;
    
    for (const asset of recentAssets) {
      if (hashString(asset._id) === targetIdNum) {
        targetSanityId = asset._id;
        break;
      }
    }

    if (targetSanityId) {
      const patch = writeClient.patch(targetSanityId);
      // 把收到的原生数据包强行写进 description 里面作为我们的查错日志！！！
      patch.set({ description: `DEBUG PAYLOAD: ${rawBodyDump}` });
      if (altText) patch.set({ altText: altText });
      if (titleText) patch.set({ title: titleText, originalFilename: titleText });
      await patch.commit();
    } else {
       console.warn(`[Media Update API] Could not find Sanity asset matching hash ID ${id}`);
    }

    return NextResponse.json({
      id: targetIdNum,
      date: new Date().toISOString(),
      status: 'inherit',
      type: 'attachment',
      title: { rendered: titleText || id },
      alt_text: altText || '',
    }, { status: 200, headers: getCorsHeaders() });

  } catch (error: any) {
    console.error("[Media Update API] Error: ", error);
    return NextResponse.json({ message: 'Update failed', error: error.message }, { status: 500, headers: getCorsHeaders() });
  }
}

export { POST as PUT, POST as PATCH };
