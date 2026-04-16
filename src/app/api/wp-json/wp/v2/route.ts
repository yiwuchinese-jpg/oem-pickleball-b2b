import { NextResponse } from 'next/server';
import { getCorsHeaders } from './utils';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: getCorsHeaders() });
}

export async function GET() {
  return NextResponse.json({
    namespace: "wp/v2",
    routes: {
      "/wp/v2": {},
      "/wp/v2/posts": {},
      "/wp/v2/users/me": {},
    }
  }, { status: 200, headers: getCorsHeaders() });
}
