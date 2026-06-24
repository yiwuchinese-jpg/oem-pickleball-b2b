export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Disposition, X-WP-Nonce, X-Requested-With, Accept',
    'Access-Control-Expose-Headers': 'X-WP-Total, X-WP-TotalPages'
  };
}

export function unauthorizedResponse() {
  return Response.json(
    { code: 'rest_forbidden', message: 'Unauthorized', data: { status: 401 } },
    {
      status: 401,
      headers: {
        ...getCorsHeaders(),
        'WWW-Authenticate': 'Basic realm="Evolution 301"',
      },
    }
  );
}

export function serverAuthConfigErrorResponse() {
  return Response.json(
    { code: 'server_config_error', message: 'Missing WP mock credentials', data: { status: 500 } },
    { status: 500, headers: getCorsHeaders() }
  );
}

export function isWpRequestAuthorized(request: Request) {
  const user = process.env.WP_MOCK_USERNAME;
  const pass = process.env.WP_MOCK_PASSWORD;

  if (!user || !pass) return null;

  const authHeader = request.headers.get('authorization');
  const expectedToken = Buffer.from(`${user}:${pass}`).toString('base64');
  return authHeader === `Basic ${expectedToken}`;
}

export function requireWpAuth(request: Request) {
  const authorized = isWpRequestAuthorized(request);
  if (authorized === null) return serverAuthConfigErrorResponse();
  if (!authorized) return unauthorizedResponse();
  return null;
}

export function clampInt(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(value || '', 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
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
  { id: 5, name: 'Custom Paddles', slug: 'custom-paddles', count: 0, description: 'Custom Paddle related articles', parent: 0, meta: [], taxonomy: 'category', link: `${SITE_URL}/category/custom-paddles` },
];

export function findCategoryNameById(id: number): string | undefined {
  return categories.find(c => c.id === id)?.name;
}

export function findCategoryIdByName(name: string): number | undefined {
  return categories.find(c => c.name === name)?.id;
}

export function getNextCategoryId(): number {
  return Math.max(...categories.map(c => c.id), 0) + 1;
}
