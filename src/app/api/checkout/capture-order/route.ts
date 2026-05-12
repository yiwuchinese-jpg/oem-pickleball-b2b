import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from '@/lib/email';
import { getPaypalBaseUrl, generatePaypalAccessToken } from '@/lib/paypal';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role to bypass RLS and update order
);

export async function POST(req: Request) {
  try {
    const { orderID } = await req.json();

    if (!orderID) {
      return NextResponse.json({ error: "Missing orderID" }, { status: 400 });
    }

    const baseUrl = getPaypalBaseUrl();

    // 1. Get PayPal Access Token
    const accessToken = await generatePaypalAccessToken();

    // 2. Call PayPal to capture the order
    const captureRes = await fetch(
      `${baseUrl}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureData = await captureRes.json();

    if (captureData.error || captureData.name === "UNPROCESSABLE_ENTITY") {
       console.error("PayPal Capture API Error:", captureData);
       return NextResponse.json({ error: captureData.message || "Capture failed" }, { status: 400 });
    }

    // 3. If capture is successful, update our database order status to 'paid'
    if (captureData.status === "COMPLETED") {
       // SECURITY: Prevent Replay Attacks (Idempotency check)
       // Check if the order is already marked as paid to prevent duplicate stock deduction and emails
       const { data: currentOrder, error: checkError } = await supabase
         .from('orders')
         .select('status, id, total_amount_cents, shipping_address, user_email')
         .eq('paypal_order_id', orderID)
         .single();
         
       if (checkError || !currentOrder) {
         console.error("Failed to find order in DB during capture:", checkError);
         return NextResponse.json({ error: "Order not found in database" }, { status: 400 });
       }
       
       if (currentOrder.status === 'paid') {
         console.log(`Order ${orderID} is already paid. Ignoring replay request.`);
         return NextResponse.json({ success: true, message: "Order already captured and processed" });
       }

       // SECURITY: Verify the captured amount matches our database to prevent partial payment spoofing
       const capturedAmount = parseFloat(captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value || "0");
       const capturedCurrency = captureData.purchase_units[0]?.payments?.captures[0]?.amount?.currency_code;
       
       // Compare amounts (cents to decimal)
       const expectedAmount = parseFloat((currentOrder.total_amount_cents / 100).toFixed(2));
       if (capturedAmount < expectedAmount || capturedCurrency !== 'PHP') {
         console.error(`Amount mismatch. Expected: ${expectedAmount} PHP, Captured: ${capturedAmount} ${capturedCurrency}`);
         // Mark as fraudulent/partially paid in a real system, but for now we reject the fulfillment
         return NextResponse.json({ error: "Payment amount mismatch. Please contact support." }, { status: 400 });
       }

       // Update status to paid since validation passed
       const { data: orderData, error: dbError } = await supabase
         .from('orders')
         .update({ status: 'paid' })
         .eq('id', currentOrder.id)
         .select('*')
         .single();

       if (dbError || !orderData) {
         console.error("Failed to update order status in DB:", dbError);
         return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
       }
         
         // 3.1 Fetch Order Items to deduct inventory
         const { data: orderItems } = await supabase
           .from('order_items')
           .select('product_sku_id, quantity')
           .eq('order_id', orderData.id);
           
         if (orderItems && orderItems.length > 0) {
           for (const item of orderItems) {
            // Use RPC for atomic stock deduction to prevent race conditions
            const { error: rpcError } = await supabase.rpc('decrement_stock', {
              sku_id: item.product_sku_id,
              quantity_to_deduct: item.quantity
            });
            
            if (rpcError) {
              console.error("Failed to decrement stock atomically:", rpcError);
            }
          }
         }

         // 3.2 Push to Miaoshou ERP
         try {
           const { pushOrderToMiaoshou } = await import('@/lib/miaoshou');
           await pushOrderToMiaoshou(orderData.id);
         } catch (erpError) {
           console.error("Failed to push to Miaoshou ERP:", erpError);
           // We do not block the user flow if ERP push fails. It can be retried later.
         }

         // 3.3 Send Confirmation Emails using nodemailer (Hostinger SMTP)
         if (process.env.SMTP_USER && process.env.SMTP_PASS) {
           try {
             // 1. Send to Customer
             await sendEmail({
               to: orderData.user_email,
               subject: `Order Confirmed - #${orderData.id.split('-')[0]}`,
               html: `
                 <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                   <h1 style="color: #0b1120;">Thank You For Your Order!</h1>
                   <p>Hi,</p>
                   <p>We've received your payment and are processing your order. Your order ID is <strong>#${orderData.id.split('-')[0]}</strong>.</p>
                   <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                     <h2 style="font-size: 16px; margin-top: 0;">Order Summary</h2>
                     <p><strong>Total Amount:</strong> ₱${(orderData.total_amount_cents / 100).toFixed(2)}</p>
                     <p><strong>Shipping to:</strong> ${orderData.shipping_address.city}, ${orderData.shipping_address.country}</p>
                   </div>
                   <p>We will send you another email once your package has been shipped with the tracking details.</p>
                   <br/>
                   <p>Best regards,<br/>The DJW Pickleball Team</p>
                 </div>
               `
             });

             // 2. Send Notification to Admin (You)
             const adminEmail = process.env.ADMIN_EMAIL || 'buydiscoball@gmail.com';
             await sendEmail({
               to: adminEmail,
               subject: `🚨 NEW ORDER RECEIVED - ₱${(orderData.total_amount_cents / 100).toFixed(2)}`,
               html: `
                 <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                   <h1 style="color: #39ff14; background: #111; padding: 15px; border-radius: 8px;">New Order Alert!</h1>
                   <p><strong>Customer:</strong> ${orderData.shipping_address.firstName} ${orderData.shipping_address.lastName} (${orderData.user_email})</p>
                   <p><strong>Total Amount:</strong> ₱${(orderData.total_amount_cents / 100).toFixed(2)}</p>
                   <p><strong>Order ID:</strong> ${orderData.id}</p>
                   <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
                     <h2 style="font-size: 16px; margin-top: 0; color: #111;">Action Required</h2>
                     <p>Please log in to the admin dashboard to fulfill this order.</p>
                   </div>
                 </div>
               `
             });
           } catch (emailErr) {
             console.error("Failed to send order emails via nodemailer:", emailErr);
           }
         }
       }

    return NextResponse.json({ success: true, captureData });
  } catch (error: any) {
    console.error("Capture Order Backend Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}