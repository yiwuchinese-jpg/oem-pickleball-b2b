import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// Basic verification of PayPal webhook
// In production, use the actual PayPal webhook verification API
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function verifyPayPalWebhook(req: Request, rawBody: string) {
  // Extract headers
  const transmissionId = req.headers.get('paypal-transmission-id');
  const transmissionTime = req.headers.get('paypal-transmission-time');
  const certUrl = req.headers.get('paypal-cert-url');
  const authAlgo = req.headers.get('paypal-auth-algo');
  const transmissionSig = req.headers.get('paypal-transmission-sig');

  if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
    return false;
  }

  // Generate an access token to verify the signature via PayPal API
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!clientId || !clientSecret || !webhookId) {
    console.error("Missing PayPal Webhook Credentials");
    return false;
  }

  // Determine PayPal API Base URL based on environment
  const mode = process.env.NEXT_PUBLIC_PAYPAL_MODE || 'sandbox';
  const paypalBaseUrl = mode === 'live'
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  try {
    const tokenRes = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    
    const { access_token } = await tokenRes.json();

    const verifyRes = await fetch(`${paypalBaseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: JSON.parse(rawBody)
      })
    });

    const verifyData = await verifyRes.json();
    return verifyData.verification_status === "SUCCESS";
  } catch (error) {
    console.error("Webhook Verification Error:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    
    // ENFORCE: Verify webhook signature. Fails request if invalid or credentials missing.
    const isVerified = await verifyPayPalWebhook(request, rawBody);
    if (!isVerified) {
      console.error("PayPal Webhook Signature Verification Failed");
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event_type === 'CHECKOUT.ORDER.APPROVED' || event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const orderId = event.resource.id || event.resource.supplementary_data?.related_ids?.order_id;
      
      if (!orderId) {
        return NextResponse.json({ error: 'Order ID not found in payload' }, { status: 400 });
      }

      const supabase = createAdminClient();

      // 1. Update order status to paid
      const { data: orderData, error: updateError } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('paypal_order_id', orderId)
        .select('id')
        .single();

      if (updateError || !orderData) {
        console.error('Failed to update order status:', updateError);
        return NextResponse.json({ error: 'Order update failed' }, { status: 500 });
      }

      // 2. Fetch order items to deduct stock
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('product_sku_id, quantity')
        .eq('order_id', orderData.id);

      if (itemsError) {
        console.error('Failed to fetch order items:', itemsError);
        return NextResponse.json({ error: 'Failed to fetch items for stock deduction' }, { status: 500 });
      }

      // 3. Deduct stock for each item atomically
      for (const item of orderItems) {
        const { error: rpcError } = await supabase.rpc('decrement_stock', {
          sku_id: item.product_sku_id,
          quantity_to_deduct: item.quantity
        });
        if (rpcError) {
          console.error("Failed to decrement stock via Webhook:", rpcError);
        }
      }

      // 4. Trigger ERP Sync (Placeholder)
      // fetch('https://erp.miaoshou.com/api/...', ...)

      return NextResponse.json({ status: 'success', message: 'Order processed successfully' });
    }

    return NextResponse.json({ status: 'ignored', message: 'Event type not handled' });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}