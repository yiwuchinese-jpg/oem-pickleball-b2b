export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Disposition, X-WP-Nonce, X-Requested-With, Accept',
    'Access-Control-Expose-Headers': 'X-WP-Total, X-WP-TotalPages'
  };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export interface WpCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
  parent: number;
  meta: string[];
  taxonomy: string;
  link: string;
}

export const categories: WpCategory[] = [
  { id: 1, name: 'Market Insights', slug: 'market-insights', count: 0, description: 'Market trends and analysis', parent: 0, meta: [], taxonomy: 'category', link: `${SITE_URL}/category/market-insights` },
  { id: 2, name: 'Industry News', slug: 'industry-news', count: 0, description: 'Latest pickleball industry updates', parent: 0, meta: [], taxonomy: 'category', link: `${SITE_URL}/category/industry-news` },
  { id: 3, name: 'Factory Tips', slug: 'factory-tips', count: 0, description: 'Manufacturing and factory insights', parent: 0, meta: [], taxonomy: 'category', link: `${SITE_URL}/category/factory-tips` },
  { id: 4, name: 'Product Guides', slug: 'product-guides', count: 0, description: 'Pickleball product buying guides', parent: 0, meta: [], taxonomy: 'category', link: `${SITE_URL}/category/product-guides` },
];

export function findCategoryNameById(id: number): string | undefined {
  return categories.find(c => c.id === id)?.name;
}

export function getNextCategoryId(): number {
  return Math.max(...categories.map(c => c.id), 0) + 1;
}
