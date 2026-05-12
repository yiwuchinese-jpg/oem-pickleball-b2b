import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // STRICT ADMIN CHECK: Use environment variable only
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

    if (authError || !user || !ADMIN_EMAIL || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized Access. Admins only.' }, { status: 403 });
    }
    
    const adminClient = createAdminClient();
    
    // Fetch all orders for the admin dashboard
    const { data, error } = await adminClient
      .from('orders')
      .select('*, order_items(*, products(title), product_skus(image_url, sku_code))')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching all orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API /api/admin/orders error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
