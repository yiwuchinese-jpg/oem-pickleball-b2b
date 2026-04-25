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
    
    // 我们尝试获取 body 里的更新信息（可能是 application/json 或 multipart）
    const contentType = request.headers.get('content-type') || '';
    let altText;
    let titleText;

    if (contentType.includes('application/json')) {
      const body = await request.json().catch(() => ({}));
      altText = body.alt_text;
      titleText = typeof body.title === 'object' ? body.title.rendered : body.title;
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData().catch(() => new FormData());
      altText = formData.get('alt_text') as string;
      titleText = formData.get('title') as string;
    }

    if (altText || titleText) {
      // 获取最近的 150 张图片以进行哈希匹配
      const recentAssets = await client.fetch(`*[_type == "sanity.imageAsset"] | order(_createdAt desc)[0...150] { _id }`);
      let targetSanityId = null;
      
      for (const asset of recentAssets) {
        if (hashString(asset._id) === targetIdNum) {
          targetSanityId = asset._id;
          break;
        }
      }

      if (targetSanityId) {
        const patch = writeClient.patch(targetSanityId);
        if (altText) patch.set({ altText: altText, description: altText });
        if (titleText) patch.set({ title: titleText, originalFilename: titleText });
        await patch.commit();
      } else {
         console.warn(`[Media Update API] Could not find Sanity asset matching hash ID ${id}`);
      }
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
