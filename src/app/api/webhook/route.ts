import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[webhook] signature failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutComplete(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  // Retrieve full session with line items
  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items'],
  });

  const shipping = full.shipping_details;
  if (!shipping?.address) return;

  // Upsert customer
  const customer = await prisma.customer.upsert({
    where:  { email: full.customer_details!.email! },
    update: {},
    create: {
      email:     full.customer_details!.email!,
      firstName: full.customer_details!.name?.split(' ')[0],
      lastName:  full.customer_details!.name?.split(' ').slice(1).join(' '),
      phone:     full.customer_details!.phone ?? undefined,
    },
  });

  // Generate order number
  const count = await prisma.order.count();
  const orderNumber = `EN-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

  await prisma.order.create({
    data: {
      orderNumber,
      customerId:      customer.id,
      stripeSessionId: session.id,
      stripePaymentId: session.payment_intent as string,
      status:          'PAID',
      totalCad:        session.amount_total ?? 0,
      taxCad:          session.total_details?.amount_tax ?? 0,
      shippingCad:     session.total_details?.amount_shipping ?? 0,
      shippingName:    shipping.name ?? '',
      shippingEmail:   full.customer_details!.email!,
      shippingLine1:   shipping.address.line1 ?? '',
      shippingLine2:   shipping.address.line2 ?? undefined,
      shippingCity:    shipping.address.city ?? '',
      shippingProvince:shipping.address.state ?? '',
      shippingPostal:  shipping.address.postal_code ?? '',
      shippingCountry: shipping.address.country ?? 'CA',
    },
  });
}
