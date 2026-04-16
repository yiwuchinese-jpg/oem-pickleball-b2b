import { NextResponse } from 'next/server';
import { getCorsHeaders } from './wp/v2/utils';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: getCorsHeaders() });
}

export async function GET() {
  return NextResponse.json({
    name: "Evolution Mock WP",
    description: "Mock WP for Evolution",
    url: "http://localhost:3000",
    home: "http://localhost:3000",
    namespaces: ["wp/v2"]
  }, { status: 200, headers: getCorsHeaders() });
}
