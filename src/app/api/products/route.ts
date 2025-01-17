import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        image: body.image,
        category: body.category,
        stock: body.stock,
        isNew: body.isNew,
        isFeatured: body.isFeatured
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: '商品の登録に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}