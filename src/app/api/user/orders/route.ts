import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();
    
    const { data, error } = await adminClient
      .from('orders')
      .select('*, order_items(*, products(title), product_skus(image_url, sku_code))')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API /api/user/orders error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
