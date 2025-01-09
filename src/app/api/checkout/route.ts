import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { cartItems } = await request.json();

    // Stripe用の商品リストを作成
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'jpy',
        product_data: {
          name: item.product.name,
          description: `${item.size ? `サイズ: ${item.size}` : ''}`,
        },
        unit_amount: item.product.price,
      },
      quantity: item.quantity,
    }));

    // Stripeセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'チェックアウトに失敗しました' },
      { status: 500 }
    );
  }
}