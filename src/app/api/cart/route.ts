import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// カート内の商品を取得
export async function GET() {
  try {
    const cartItems = await prisma.cart.findMany({
      include: {
        product: true,
      },
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// カートに商品を追加
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const cartItem = await prisma.cart.create({
      data: {
        userId: 'guest', // 将来的に認証システムと連携
        productId: json.productId,
        quantity: json.quantity,
        size: json.size,
      },
      include: {
        product: true,
      },
    });
    return NextResponse.json(cartItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}