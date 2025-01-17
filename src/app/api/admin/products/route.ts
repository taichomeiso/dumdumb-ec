import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const isAdmin = session.user.email === process.env.ADMIN_EMAIL;
    if (!isAdmin) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    const body = await request.json();

    // 必須フィールドのバリデーション
    if (!body.name || !body.price || !body.description || !body.image || !body.category) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // 価格と在庫数のバリデーション
    if (typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json(
        { error: '価格が正しくありません' },
        { status: 400 }
      );
    }

    if (typeof body.stock !== 'number' || body.stock < 0) {
      return NextResponse.json(
        { error: '在庫数が正しくありません' },
        { status: 400 }
      );
    }

    // デフォルト値の設定
    const productData = {
      name: body.name,
      price: body.price,
      description: body.description,
      image: body.image,
      category: body.category,
      stock: body.stock || 0,
      isNew: body.isNew || false,
      isFeatured: body.isFeatured || false,
      stockAlert: body.stockAlert || 5
    };

    const product = await prisma.product.create({
      data: productData
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
      { error: '商品の取得に失敗しました' },
      { status: 500 }
    );
  }
}