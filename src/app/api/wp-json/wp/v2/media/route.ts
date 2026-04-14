import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';
import { getCorsHeaders } from '../utils';

export async function OPTIONS() { return NextResponse.json({}, { headers: getCorsHeaders() }); }

export async function POST(request: Request) {
  try {
    let file: File | null = null;
    let buffer: Buffer | null = null;
    let filename = `upload-${Date.now()}.jpg`;
    let altText = "AI Generated Image";
    let titleFromForm = filename;

    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Safely find the file regardless of the field name WP uses
      let fileKey = Array.from(formData.keys()).find(k => {
        const val = formData.get(k);
        return val && typeof val === 'object' && 'arrayBuffer' in val;
      });
      
      file = fileKey ? formData.get(fileKey) as File : null;

      if (file) {
        filename = file.name || filename;
        titleFromForm = filename;
        buffer = Buffer.from(await file.arrayBuffer());
      }
      
      if (formData.has('alt_text')) altText = formData.get('alt_text') as string || altText;
      if (formData.has('title')) titleFromForm = formData.get('title') as string || titleFromForm;
    } else {
      buffer = Buffer.from(await request.arrayBuffer());
    }

    if (!buffer) return NextResponse.json({ message: "No file found" }, { status: 400, headers: getCorsHeaders() });

    const asset = await writeClient.assets.upload('image', buffer, { filename });
    const numericId = Math.floor(Math.random() * 10000000); 

    await writeClient.patch(asset._id).set({
      title: numericId.toString(),
      description: altText,
      altText: altText
    }).commit();

    return NextResponse.json({
      id: numericId,
      date: new Date().toISOString(),
      slug: filename,
      type: "attachment",
      link: asset.url,
      title: { rendered: titleFromForm },
      source_url: asset.url,
    }, { status: 201, headers: getCorsHeaders() });
    
  } catch (error: any) {
    return NextResponse.json({ message: "Upload failed", error: error.message }, { status: 500, headers: getCorsHeaders() });
  }
}
