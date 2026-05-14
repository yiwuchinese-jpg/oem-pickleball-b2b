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
      "/wp/v2/posts/(?P<id>[\\d]+)": {},
      "/wp/v2/media": {},
      "/wp/v2/media/(?P<id>[\\d]+)": {},
      "/wp/v2/categories": {},
      "/wp/v2/tags": {},
      "/wp/v2/taxonomies": {},
      "/wp/v2/users/me": {},
      "/wp/v2/plugins": {},
    }
  }, { status: 200, headers: getCorsHeaders() });
}
