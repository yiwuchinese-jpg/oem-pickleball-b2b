import { NextResponse } from 'next/server';
import { getCorsHeaders } from '../utils';

export async function OPTIONS() { return NextResponse.json({}, { headers: getCorsHeaders() }); }
export async function GET() { return NextResponse.json([], { headers: getCorsHeaders() }); }
