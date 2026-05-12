import { NextResponse } from 'next/server';
import { getCorsHeaders } from '../../utils';
import { Buffer } from 'buffer';

export const runtime = 'nodejs';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: getCorsHeaders() });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // SECURE: No hardcoded credentials. Must be set in .env.local
  const user = process.env.WP_MOCK_USERNAME;
  const pass = process.env.WP_MOCK_PASSWORD;
  
  if (!user || !pass) {
    return NextResponse.json({ message: "Server configuration error: Missing WP Mock credentials" }, { status: 500, headers: getCorsHeaders() });
  }

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
