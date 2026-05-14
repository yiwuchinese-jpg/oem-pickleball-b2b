import { NextResponse } from 'next/server';
import { getCorsHeaders } from '../utils';

const TAGS = [
  { id: 1, name: 'Pickleball', slug: 'pickleball', count: 0 },
  { id: 2, name: 'Pickleball Equipment', slug: 'pickleball-equipment', count: 0 },
  { id: 3, name: 'Wholesale', slug: 'wholesale', count: 0 },
  { id: 4, name: 'OEM Manufacturing', slug: 'oem-manufacturing', count: 0 },
  { id: 5, name: 'Paddle', slug: 'paddle', count: 0 },
  { id: 6, name: 'B2B', slug: 'b2b', count: 0 },
  { id: 7, name: 'Factory', slug: 'factory', count: 0 },
  { id: 8, name: 'Sports Equipment', slug: 'sports-equipment', count: 0 },
];

export async function OPTIONS() { return NextResponse.json({}, { headers: getCorsHeaders() }); }
export async function GET() { return NextResponse.json(TAGS, { headers: getCorsHeaders() }); }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name || body.name?.rendered || 'New Tag';
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const newId = Math.max(...TAGS.map(t => t.id), 0) + 1;
    const tag = { id: newId, name, slug, count: 0 };
    TAGS.push(tag);
    return NextResponse.json(tag, { status: 201, headers: getCorsHeaders() });
  } catch {
    return NextResponse.json({ message: 'Tag creation failed' }, { status: 500, headers: getCorsHeaders() });
  }
}
