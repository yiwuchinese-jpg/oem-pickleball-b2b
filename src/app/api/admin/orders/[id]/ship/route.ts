import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/lib/email';
import { getPaypalBaseUrl, generatePaypalAccessToken } from '@/lib/paypal';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // STRICT ADMIN CHECK: Use environment variable, fallback failsafe removed for security
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

    if (authError || !user || !ADMIN_EMAIL || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized Access. Admins only.' }, { status: 403 });
    }

    const { tracking_number } = await request.json();
    const { id: orderId } = await params;

    if (!tracking_number) {
      return NextResponse.json({ error: 'Tracking number is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // 1. Update order status and tracking number
    const { data: order, error } = await adminClient
      .from('orders')
      .update({ status: 'shipped', tracking_number })
      .eq('id', orderId)
      .select('*')
      .single();

    if (error || !order) {
      console.error("Error updating order:", error);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    // 2. Sync Tracking Number to PayPal
    if (order.paypal_order_id) {
      try {
        const baseUrl = getPaypalBaseUrl();

        // 2.1 Get Access Token
        const accessToken = await generatePaypalAccessToken();

        // 2.2 Get Order Details to find the Capture ID (Transaction ID)
        const orderRes = await fetch(`${baseUrl}/v2/checkout/orders/${order.paypal_order_id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const paypalOrderData = await orderRes.json();
        
        let captureId = null;
        if (paypalOrderData.purchase_units && paypalOrderData.purchase_units[0].payments && paypalOrderData.purchase_units[0].payments.captures) {
          captureId = paypalOrderData.purchase_units[0].payments.captures[0].id;
        }

        // 2.3 Send Tracking Info to PayPal
        if (captureId) {
          const trackRes = await fetch(`${baseUrl}/v2/checkout/orders/${order.paypal_order_id}/track`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                transaction_id: captureId,
                tracking_number: tracking_number,
                status: "SHIPPED",
                carrier: "OTHER"
              }),
            });
            
            const trackData = await trackRes.json().catch(() => null); // sometimes returns 201 Created with no body
            console.log("PayPal Tracking API Response:", trackRes.status, trackData);
          } else {
            console.error("Could not find capture ID for PayPal Order:", order.paypal_order_id);
          }
      } catch (paypalErr) {
        console.error("Failed to sync tracking to PayPal:", paypalErr);
        // Do not fail the overall request, let the DB update and email proceed
      }
    }

    // 3. Send Shipping Confirmation Email via nodemailer
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const trackingUrl = `https://t.17track.net/en#nums=${tracking_number}`;
        
        await sendEmail({
          to: order.user_email,
          subject: `Your Order #${order.id.split('-')[0]} has been Shipped!`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #0b1120;">Good News! Your Order is on the way.</h1>
              <p>Hi ${order.shipping_address.firstName},</p>
              <p>We have just shipped your order <strong>#${order.id.split('-')[0]}</strong>.</p>
              
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
                <h2 style="font-size: 16px; margin-top: 0; color: #111;">Tracking Details</h2>
                <p style="font-size: 18px; font-family: monospace; font-weight: bold; color: #39ff14; background: #111; padding: 10px; text-align: center; border-radius: 6px;">
                  ${tracking_number}
                </p>
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${trackingUrl}" style="background-color: #39ff14; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 50px; display: inline-block;">
                    Track Package
                  </a>
                </div>
              </div>
              
              <p>Please note that it may take 24-48 hours for the tracking information to update on the carrier's website.</p>
              <p>If you have any questions, feel free to reply to this email.</p>
              <br/>
              <p>Best regards,<br/>The DJW Pickleball Team</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("Failed to send shipping email:", emailErr);
        // We don't fail the request if the email fails, as the DB update was successful
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("API /api/admin/orders/[id]/ship error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
