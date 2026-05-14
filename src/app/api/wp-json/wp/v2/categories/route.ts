import { NextResponse } from 'next/server';
import { getCorsHeaders } from '../utils';

const CATEGORIES = [
  { id: 1, name: 'Market Insights', slug: 'market-insights', count: 0 },
  { id: 2, name: 'Industry News', slug: 'industry-news', count: 0 },
  { id: 3, name: 'Factory Tips', slug: 'factory-tips', count: 0 },
  { id: 4, name: 'Product Guides', slug: 'product-guides', count: 0 },
];

export async function OPTIONS() { return NextResponse.json({}, { headers: getCorsHeaders() }); }
export async function GET() { return NextResponse.json(CATEGORIES, { headers: getCorsHeaders() }); }
