import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';
import { getCorsHeaders } from '../utils';
import { client } from '@/sanity/lib/client';
import { Buffer } from 'buffer';

export const runtime = 'nodejs';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export async function OPTIONS() { return NextResponse.json({}, { headers: getCorsHeaders() }); }

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('per_page') || '10', 10);
    const search = searchParams.get('search') || '';

    const start = (page - 1) * perPage;
    const end = start + perPage;

    let queryCondition = `_type == "sanity.imageAsset"`;
    if (search) {
      queryCondition += ` && (title match "*${search}*" || originalFilename match "*${search}*")`;
    }

    const totalCount = await client.fetch(`count(*[${queryCondition}])`);
    const totalPages = Math.ceil(totalCount / perPage);

    const assets = await client.fetch(`*[${queryCondition}] | order(_createdAt desc)[${start}...${end}] {
      _id,
      _createdAt,
      url,
      originalFilename,
      title,
      description,
      altText
    }`);

    const mapped = assets.map((asset: any) => {
      // 稳定的数字 ID
      const numericId = hashString(asset._id);
      return {
        id: numericId,
        date: asset._createdAt,
        slug: asset.originalFilename || `image-${numericId}`,
        type: 'attachment',
        link: asset.url,
        title: { rendered: asset.title || asset.originalFilename || 'Image' },
        caption: { rendered: asset.description || '' },
        alt_text: asset.altText || '',
        source_url: asset.url,
        media_type: 'image',
        mime_type: 'image/jpeg',
      };
    });

    const headers = new Headers(getCorsHeaders() as any);
    headers.set('X-WP-Total', totalCount.toString());
    headers.set('X-WP-TotalPages', totalPages.toString());

    return NextResponse.json(mapped, { status: 200, headers });
  } catch (error) {
    console.error("Media GET error:", error);
    return NextResponse.json([], { status: 200, headers: getCorsHeaders() });
  }
}

export async function POST(request: Request) {
  try {
    let uploadBuffer: Buffer | null = null;
    let filename = `upload-${Date.now()}.jpg`;
    let altText = "AI Generated Image";
    let titleFromForm = filename;

    const contentType = request.headers.get('content-type') || '';
    const clonedReq = request.clone();
    
    if (contentType.includes('multipart/form-data')) {
      try {
        const formData = await request.formData();
        
        let fileEntry: any = formData.get('file') || formData.get('async-upload');
        if (!fileEntry) {
            const fileKey = Array.from(formData.keys()).find(k => {
              const val = formData.get(k);
              return val && typeof val === 'object';
            });
            if (fileKey) fileEntry = formData.get(fileKey);
        }

        if (fileEntry && typeof fileEntry === 'object') {
          filename = fileEntry.name || filename;
          const arrayBuf = await fileEntry.arrayBuffer();
          uploadBuffer = Buffer.from(arrayBuf);
        }
        
        if (formData.has('alt_text')) altText = formData.get('alt_text') as string;
        if (formData.has('title')) titleFromForm = formData.get('title') as string;
      } catch (err) {
        console.error("FormData parse failed, falling back");
      }
    } 
    
    if (!uploadBuffer && contentType.includes('application/json')) {
      try {
        const jsonBody = await request.json();
        const rawData = jsonBody.file || jsonBody.data || jsonBody.image || jsonBody.content;
        if (rawData) {
          const base64Data = rawData.replace(/^data:image\/\w+;base64,/, "");
          uploadBuffer = Buffer.from(base64Data, 'base64');
        }
        filename = jsonBody.filename || jsonBody.title || filename;
        titleFromForm = jsonBody.title || filename;
        altText = jsonBody.alt_text || altText;
      } catch (err) {
        console.error("JSON parse failed, falling back");
      }
    } 
    
    if (!uploadBuffer) {
      try {
        const disposition = request.headers.get('content-disposition');
        if (disposition) {
           const match = disposition.match(/filename="?([^"]+)"?/);
           if (match) filename = match[1];
        }
        const arrayBuf = await clonedReq.arrayBuffer();
        if (arrayBuf.byteLength > 0) {
            uploadBuffer = Buffer.from(arrayBuf);
            titleFromForm = filename;
        }
      } catch (err) {}
    }

    if (!uploadBuffer || uploadBuffer.length === 0) {
      // 绝对不能报 500，返回带调试信息的 200 或 400
      return NextResponse.json({ 
        message: "No valid image buffer extracted. Content-Type was: " + contentType,
        data: { status: 400 }
      }, { status: 400, headers: getCorsHeaders() });
    }

    // 清理文件名，防止特殊字符导致 Sanity 炸掉
    filename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');

    console.log(`[Media API] Uploading ${filename} to Sanity...`);
    const asset = await writeClient.assets.upload('image', uploadBuffer, { filename });
    console.log(`[Media API] Upload success: ${asset._id}`);

    const numericId = hashString(asset._id);

    // 回写信息到 Sanity
    await writeClient.patch(asset._id).set({
      title: titleFromForm,
      description: altText,
      altText: altText
    }).commit();

    return NextResponse.json({
      id: numericId,
      date: new Date().toISOString(),
      date_gmt: new Date().toISOString(),
      slug: filename,
      status: "inherit",
      type: "attachment",
      link: asset.url,
      title: { rendered: titleFromForm },
      author: 1,
      comment_status: "closed",
      ping_status: "closed",
      template: "",
      meta: [],
      description: { rendered: altText },
      caption: { rendered: "" },
      alt_text: altText,
      media_type: "image",
      mime_type: "image/jpeg",
      media_details: {
        width: 1024,
        height: 1024,
        file: filename,
        sizes: {
          full: {
            file: filename,
            width: 1024,
            height: 1024,
            mime_type: "image/jpeg",
            source_url: asset.url
          }
        },
        image_meta: {}
      },
      source_url: asset.url,
    }, { status: 201, headers: getCorsHeaders() });
    
  } catch (error: any) {
    console.error("[Media API] Fatal Upload Error: ", error);
    // 即使底层全面崩溃，也不返回 500 导致弹窗！返回 400 把错误送给 301！
    return NextResponse.json({ 
      code: "rest_upload_sideload_error",
      message: `Fatal upload crash: ${error?.message || "Unknown error"}. Check Vercel logs.`,
      data: { status: 400 }
    }, { status: 400, headers: getCorsHeaders() });
  }
}



