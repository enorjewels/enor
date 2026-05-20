import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import type { CartItem } from '@/types';
import { METAL_LABELS, KARAT_LABELS } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { cartItems }: { cartItems: CartItem[] } = await req.json();

    if (!cartItems?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency:     'cad',
        unit_amount:  item.priceCad,
        product_data: {
          name: `${item.name} — ${KARAT_LABELS[item.karat]} ${METAL_LABELS[item.metal]}${item.size ? `, Size ${item.size}` : ''}`,
          images: [item.image],
        },
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode:                 'payment',
      line_items:           lineItems,
      currency:             'cad',
      automatic_tax:        { enabled: true },      // Stripe Tax handles GST/HST/PST
      shipping_address_collection: {
        allowed_countries: ['CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type:         'fixed_amount',
            fixed_amount: { amount: 0, currency: 'cad' },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 8 },
            },
          },
        },
        {
          shipping_rate_data: {
            type:         'fixed_amount',
            fixed_amount: { amount: 1500, currency: 'cad' },
            display_name: 'Express 2-day',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 2 },
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/bag`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout]', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
