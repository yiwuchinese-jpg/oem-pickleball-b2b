import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';
import { getCorsHeaders } from '../utils';
import { client } from '@/sanity/lib/client';
import { Buffer } from 'buffer';

export const runtime = 'nodejs'; // 强制使用 Node.js 运行时，确保 Buffer 绝对可用

export async function OPTIONS() { return NextResponse.json({}, { headers: getCorsHeaders() }); }

export async function GET() {
  try {
    const assets = await client.fetch(`*[_type == "sanity.imageAsset"] | order(_createdAt desc)[0...50] {
      _id,
      _createdAt,
      url,
      originalFilename,
      title,
      description,
      altText
    }`);

    const mapped = assets.map((asset: any, index: number) => ({
      id: parseInt(asset.title) || (index + 1),
      date: asset._createdAt,
      slug: asset.originalFilename || `image-${index}`,
      type: 'attachment',
      link: asset.url,
      title: { rendered: asset.originalFilename || 'Image' },
      caption: { rendered: asset.description || '' },
      alt_text: asset.altText || '',
      source_url: asset.url,
      media_type: 'image',
      mime_type: 'image/jpeg',
    }));

    return NextResponse.json(mapped, { status: 200, headers: getCorsHeaders() });
  } catch {
    return NextResponse.json([], { status: 200, headers: getCorsHeaders() });
  }
}

export async function POST(request: Request) {
  try {
    // 强制尝试读取 body，但不做任何强解析，以防止 body 太大导致底层抛错被屏蔽
    try { await request.arrayBuffer(); } catch(e) {}
    
    // 不管前端传了什么，不管是不是 JSON 还是 multipart，我们统统强制返回成功
    // 伪造一个 WP 的返回体，这是为了排查究竟是前端路由问题还是我们解析代码问题
    const mockId = Math.floor(Math.random() * 10000000);
    const mockUrl = "https://cdn.sanity.io/images/hm6skjpo/production/mock-image.jpg";
    
    return NextResponse.json({
      id: mockId,
      date: new Date().toISOString(),
      date_gmt: new Date().toISOString(),
      slug: "mock-test",
      status: "inherit",
      type: "attachment",
      link: mockUrl,
      title: { rendered: "mock-test" },
      author: 1,
      comment_status: "closed",
      ping_status: "closed",
      template: "",
      meta: [],
      description: { rendered: "AI Generated Image" },
      caption: { rendered: "" },
      alt_text: "AI Generated Image",
      media_type: "image",
      mime_type: "image/jpeg",
      media_details: {
        width: 1024,
        height: 1024,
        file: "mock-test.jpg",
        sizes: {
          full: {
            file: "mock-test.jpg",
            width: 1024,
            height: 1024,
            mime_type: "image/jpeg",
            source_url: mockUrl
          }
        },
        image_meta: {}
      },
      source_url: mockUrl,
    }, { status: 201, headers: getCorsHeaders() });
    
  } catch (error: any) {
    return NextResponse.json({ 
      code: "rest_upload_sideload_error",
      message: error?.message || "Upload failed", 
      data: { status: 500 }
    }, { status: 200, headers: getCorsHeaders() }); // 就算是这里我们也返回200
  }
}


