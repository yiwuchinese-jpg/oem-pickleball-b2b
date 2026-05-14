import { NextResponse } from 'next/server';
import { getCorsHeaders } from '../utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const CATEGORIES = [
  { id: 1, name: 'Market Insights', slug: 'market-insights', count: 0, description: 'Market trends and analysis', parent: 0, meta: [], taxonomy: 'category', link: `${SITE_URL}/category/market-insights` },
  { id: 2, name: 'Industry News', slug: 'industry-news', count: 0, description: 'Latest pickleball industry updates', parent: 0, meta: [], taxonomy: 'category', link: `${SITE_URL}/category/industry-news` },
  { id: 3, name: 'Factory Tips', slug: 'factory-tips', count: 0, description: 'Manufacturing and factory insights', parent: 0, meta: [], taxonomy: 'category', link: `${SITE_URL}/category/factory-tips` },
  { id: 4, name: 'Product Guides', slug: 'product-guides', count: 0, description: 'Pickleball product buying guides', parent: 0, meta: [], taxonomy: 'category', link: `${SITE_URL}/category/product-guides` },
];

export async function OPTIONS() { return NextResponse.json({}, { headers: getCorsHeaders() }); }
export async function GET() { return NextResponse.json(CATEGORIES, { headers: getCorsHeaders() }); }
