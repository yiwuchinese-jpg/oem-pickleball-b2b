import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';
import { client } from '@/sanity/lib/client';
import { getCorsHeaders } from '../../utils';

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

    // 查找在 Sanity 里对应的 asset (通过 title == ID)
    if (altText || titleText) {
      const existingDoc = await client.fetch(`*[_type == "sanity.imageAsset" && title == $id][0]`, { id });
      if (existingDoc) {
        const patch = writeClient.patch(existingDoc._id);
        if (altText) patch.set({ altText: altText, description: altText });
        await patch.commit();
      }
    }

    return NextResponse.json({
      id: parseInt(id),
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
