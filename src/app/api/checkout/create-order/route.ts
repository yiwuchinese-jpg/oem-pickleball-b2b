import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { generatePaypalAccessToken, getPaypalBaseUrl } from '@/lib/paypal';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, saveToAddressBook } = body;

    if (!items || items.length === 0 || !shippingAddress) {
      return NextResponse.json({ error: 'Missing items or shipping address' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Optionally save the address to the user's address book if requested
    if (saveToAddressBook && shippingAddress.email) {
      // Check if this exact address already exists
      const { data: existingAddresses } = await supabase
        .from('user_addresses')
        .select('id')
        .eq('user_email', shippingAddress.email)
        .eq('first_name', shippingAddress.firstName)
        .eq('last_name', shippingAddress.lastName)
        .eq('address', shippingAddress.address)
        .eq('city', shippingAddress.city)
        .eq('zip_code', shippingAddress.zipCode);

      // Only insert if it doesn't already exist
      if (!existingAddresses || existingAddresses.length === 0) {
        // Check if they have any addresses to determine if this should be default
        const { count } = await supabase
          .from('user_addresses')
          .select('*', { count: 'exact', head: true })
          .eq('user_email', shippingAddress.email);
          
        const isFirstAddress = count === 0;

        await supabase.from('user_addresses').insert({
          user_email: shippingAddress.email,
          first_name: shippingAddress.firstName,
          last_name: shippingAddress.lastName,
          address: shippingAddress.address,
          apartment: shippingAddress.apartment,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip_code: shippingAddress.zipCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
          is_default: isFirstAddress // Make it default if it's their first saved address
        });
      }
    }
    
    let totalCents = 0;
    const validatedItems = [];

    // Fetch the main product id from sku table directly to ensure we have the correct UUID
    for (const item of items) {
      // SECURITY: Validate quantity to prevent negative or fractional quantities (which could manipulate total price)
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json({ error: `Invalid quantity for SKU ${item.skuId}` }, { status: 400 });
      }

      const { data: skuData, error } = await supabase
        .from('product_skus')
        .select('id, product_id, price_cents, stock_quantity')
        .eq('id', item.skuId)
        .single();

      if (error || !skuData) {
        return NextResponse.json({ error: `SKU ${item.skuId} not found` }, { status: 400 });
      }

      if (skuData.stock_quantity < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for SKU ${item.skuId}` }, { status: 400 });
      }

      totalCents += skuData.price_cents * item.quantity;
      validatedItems.push({
        product_id: skuData.product_id,
        product_sku_id: skuData.id,
        quantity: item.quantity,
        unit_price_cents: skuData.price_cents,
      });
    }

    // Basic shipping logic: 50 RMB per item * 8.874 = 443.7 PHP -> 44370 cents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalQuantity = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const shippingFeeCents = totalQuantity > 0 ? Math.round(totalQuantity * 50 * 8.874 * 100) : 0;
    const grandTotalCents = Math.round(totalCents + shippingFeeCents);

    // Call PayPal API to create order
    const accessToken = await generatePaypalAccessToken();
    const paypalUrl = `${getPaypalBaseUrl()}/v2/checkout/orders`;
    
    const paypalResponse = await fetch(paypalUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "PHP",
              value: (grandTotalCents / 100).toFixed(2)
            },
          },
        ],
      }),
    });

    const paypalData = await paypalResponse.json();
    if (!paypalResponse.ok) {
      console.error('PayPal Order Error:', JSON.stringify(paypalData, null, 2));
      return NextResponse.json({ error: 'Failed to create PayPal order: ' + JSON.stringify(paypalData) }, { status: 500 });
    }

    const paypalOrderId = paypalData.id;

    // Create pending order in Supabase
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        paypal_order_id: paypalOrderId,
        user_email: shippingAddress.email,
        shipping_address: shippingAddress,
        total_amount_cents: grandTotalCents,
        shipping_fee_cents: shippingFeeCents,
        status: 'pending',
        erp_sync_status: false,
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Supabase Order Error:', orderError);
      return NextResponse.json({ error: 'Failed to create order in database' }, { status: 500 });
    }

    console.log("Validated items: ", validatedItems);
    // Insert order items
    const orderItemsToInsert = validatedItems.map(item => ({
      order_id: orderData.id,
      // Removed product_id as it doesn't exist in the order_items schema
      product_sku_id: item.product_sku_id,
      quantity: item.quantity,
      unit_price_cents: item.unit_price_cents
    }));
    console.log("Inserting order items: ", orderItemsToInsert);

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error('Supabase Order Items Error:', itemsError);
      return NextResponse.json({ error: 'Failed to save order items' }, { status: 500 });
    }

    return NextResponse.json({ id: paypalOrderId });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Checkout API Error Full:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}