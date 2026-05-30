import { NextResponse } from 'next/server';
import { getCorsHeaders, categories, getNextCategoryId } from '../utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function OPTIONS() { return NextResponse.json({}, { headers: getCorsHeaders() }); }

export async function GET() { return NextResponse.json(categories, { headers: getCorsHeaders() }); }

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = body.name || '';
    if (!name) {
      return NextResponse.json({ message: 'Category name is required' }, { status: 400, headers: getCorsHeaders() });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const id = getNextCategoryId();

    const cat = {
      id,
      name,
      slug,
      count: 0,
      description: body.description || '',
      parent: body.parent || 0,
      meta: [],
      taxonomy: 'category',
      link: `${SITE_URL}/category/${slug}`,
    };
    categories.push(cat);

    return NextResponse.json(cat, { status: 201, headers: getCorsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to create category', error: error.message }, { status: 500, headers: getCorsHeaders() });
  }
}
