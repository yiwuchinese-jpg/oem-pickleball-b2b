import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase Admin client to fetch full order data
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Generates an MD5 signature for Miaoshou ERP API
 */
function generateMiaoshouSignature(params: Record<string, string>, appSecret: string): string {
  // 1. Sort keys alphabetically
  const sortedKeys = Object.keys(params).sort();
  
  // 2. Concatenate AppSecret + KeyValue pairs + AppSecret
  let baseString = appSecret;
  for (const key of sortedKeys) {
    baseString += `${key}${params[key]}`;
  }
  baseString += appSecret;
  
  // 3. MD5 hash and convert to uppercase
  return crypto.createHash('md5').update(baseString).digest('hex').toUpperCase();
}

/**
 * Pushes an order from Supabase to Miaoshou ERP
 */
export async function pushOrderToMiaoshou(orderId: string) {
  const appKey = process.env.MIAOSHOU_APP_KEY;
  const appSecret = process.env.MIAOSHOU_APP_SECRET;

  if (!appKey || !appSecret) {
    console.warn("Miaoshou ERP credentials not configured. Skipping ERP push.");
    return { success: false, reason: "Missing credentials" };
  }

  // 1. Fetch the full order data and its items
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*, product_skus(sku_code, price_cents, weight_grams))')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  // 2. Format order data according to Miaoshou "Custom Shop API" spec
  // (Assuming a standard ERP order push structure here. This payload might need 
  // exact field mappings according to the official Miaoshou API docs)
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  
  // Format items
  const erpItems = order.order_items.map((item: any) => ({
    skuId: item.product_skus.sku_code || item.product_sku_id,
    quantity: item.quantity,
    price: (item.unit_price_cents / 100).toFixed(2),
    // Optional fields depending on API requirements
  }));

  // Create the specific business parameters
  const bizParams = {
    order_id: order.id,
    paypal_id: order.paypal_order_id,
    buyer_name: `${order.shipping_address.firstName} ${order.shipping_address.lastName}`,
    buyer_email: order.user_email,
    buyer_phone: order.shipping_address.phone,
    country: order.shipping_address.country,
    state: order.shipping_address.state,
    city: order.shipping_address.city,
    address: `${order.shipping_address.address} ${order.shipping_address.apartment || ''}`.trim(),
    zip_code: order.shipping_address.zipCode,
    total_amount: (order.total_amount_cents / 100).toFixed(2),
    shipping_fee: (order.shipping_fee_cents / 100).toFixed(2),
    currency: "PHP",
    created_at: order.created_at,
    items: erpItems
  };

  // Stringify the business parameters
  const bizParamsJson = JSON.stringify(bizParams);

  // Prepare system parameters
  const requestParams: Record<string, string> = {
    app_key: appKey,
    timestamp: timestamp,
    format: "json",
    v: "1.0",
    method: "miaoshou.order.push", // Assuming this is the endpoint method
    biz_content: bizParamsJson
  };

  // 3. Generate signature
  requestParams.sign = generateMiaoshouSignature(requestParams, appSecret);

  // 4. Send the POST request to Miaoshou ERP Gateway
  // Placeholder URL: The actual URL should be retrieved from Miaoshou documentation
  const ERP_GATEWAY_URL = "https://api.miaoshou.com/router/rest"; 
  
  console.log(`Pushing Order ${orderId} to Miaoshou ERP...`);

  try {
    // URL-encode the parameters for the body
    const formBody = new URLSearchParams(requestParams).toString();

    const response = await fetch(ERP_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    });

    const result = await response.json();

    if (result.error_response) {
      console.error("Miaoshou ERP Error:", result.error_response);
      throw new Error(`ERP Error: ${result.error_response.msg}`);
    }

    // 5. Update Supabase order to mark erp_sync_status = true
    await supabase
      .from('orders')
      .update({ erp_sync_status: true })
      .eq('id', orderId);

    console.log(`Successfully pushed Order ${orderId} to Miaoshou ERP.`);
    return { success: true, result };

  } catch (err: any) {
    console.error("Failed to connect to Miaoshou ERP API:", err);
    throw err;
  }
}