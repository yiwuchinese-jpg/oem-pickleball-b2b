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
    let uploadBuffer: Buffer | null = null;
    let filename = `upload-${Date.now()}.jpg`;
    let altText = "AI Generated Image";
    let titleFromForm = filename;

    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      let fileKey = Array.from(formData.keys()).find(k => {
        const val = formData.get(k);
        return val && typeof val === 'object' && 'arrayBuffer' in val;
      });
      
      const fileEntry = fileKey ? formData.get(fileKey) : null;

      if (fileEntry && typeof fileEntry === 'object') {
        const file = fileEntry as File;
        filename = file.name || filename;
        titleFromForm = filename;
        const arrayBuf = await file.arrayBuffer();
        uploadBuffer = Buffer.from(arrayBuf);
      }
      
      if (formData.has('alt_text')) altText = formData.get('alt_text') as string || altText;
      if (formData.has('title')) titleFromForm = formData.get('title') as string || titleFromForm;
    } else {
      // 纯二进制上传，提取 filename
      const disposition = request.headers.get('content-disposition');
      if (disposition) {
         const match = disposition.match(/filename="?([^"]+)"?/);
         if (match) filename = match[1];
      }
      const arrayBuf = await request.arrayBuffer();
      uploadBuffer = Buffer.from(arrayBuf);
      titleFromForm = filename;
    }

    if (!uploadBuffer || uploadBuffer.length === 0) {
      console.error("[Media API] Upload Failed: Buffer is empty or file not found in request");
      return NextResponse.json({ message: "No file found or file is empty" }, { status: 400, headers: getCorsHeaders() });
    }

    console.log(`[Media API] Uploading ${filename} to Sanity...`);
    const asset = await writeClient.assets.upload('image', uploadBuffer, { filename });
    console.log(`[Media API] Upload success: ${asset._id}`);

    const numericId = Math.floor(Math.random() * 10000000); 

    await writeClient.patch(asset._id).set({
      title: numericId.toString(),
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
    return NextResponse.json({ 
      code: "rest_upload_sideload_error",
      message: error?.message || "Upload failed", 
      data: { status: 500 }
    }, { status: 500, headers: getCorsHeaders() });
  }
}

