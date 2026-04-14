import { NextResponse } from 'next/server';
import { getCorsHeaders } from '../../utils';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: getCorsHeaders() });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const user = process.env.WP_MOCK_USERNAME || '894825716@qq.com';
  const pass = process.env.WP_MOCK_PASSWORD || 'Cylldjw99!';
  const expectedToken = Buffer.from(`${user}:${pass}`).toString('base64');

  if (!authHeader || authHeader !== `Basic ${expectedToken}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401, headers: getCorsHeaders() });
  }

  return NextResponse.json({
    id: 1,
    name: "Admin",
    description: "Mock Admin for Evolution 301 Integration",
    avatar_urls: { "24": "", "48": "", "96": "" }
  }, { status: 200, headers: getCorsHeaders() });
}
