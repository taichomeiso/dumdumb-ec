import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 注文一覧を取得
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// 新規注文を作成
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const order = await prisma.order.create({
      data: {
        userId: json.userId || 'guest',
        total: json.total,
        status: 'pending',
        shippingInfo: json.shippingInfo,
        paymentInfo: json.paymentInfo,
        orderItems: {
          create: json.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: item.price
          }))
        }
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}