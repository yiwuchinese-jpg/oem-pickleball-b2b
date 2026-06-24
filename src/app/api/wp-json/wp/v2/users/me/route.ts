import { NextResponse } from 'next/server';
import { getCorsHeaders, requireWpAuth } from '../../utils';

export const runtime = 'nodejs';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: getCorsHeaders() });
}

export async function GET(request: Request) {
  const authError = requireWpAuth(request);
  if (authError) return authError;

  return NextResponse.json({
    id: 1,
    name: "Admin",
    description: "Mock Admin for Evolution 301 Integration",
    avatar_urls: { "24": "", "48": "", "96": "" }
  }, { status: 200, headers: getCorsHeaders() });
}
