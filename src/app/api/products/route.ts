import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 60; // 1分ごとに再検証

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        stock: true,
        stockAlert: true,
        isNew: true,
        category: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        OR: [
          { isFeatured: true },
          { isNew: true },
          { stock: { gt: 0 } }
        ]
      }
    });

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}