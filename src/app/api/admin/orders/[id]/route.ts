import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (authError || !user || !ADMIN_EMAIL || user.email !== ADMIN_EMAIL) {
    return false;
  }
  return true;
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  
  const adminClient = createAdminClient();
  
  // order_items will fail if no ON DELETE CASCADE, so delete them first
  await adminClient.from('order_items').delete().eq('order_id', params.id);
  
  const { error } = await adminClient.from('orders').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const body = await request.json();
  const adminClient = createAdminClient();
  const { error } = await adminClient.from('orders').update(body).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
