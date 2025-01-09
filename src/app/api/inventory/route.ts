import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendStockAlert } from '@/lib/mail';

// 在庫情報を取得
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
        stockAlert: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// 在庫を更新
export async function POST(request: Request) {
  try {
    const { productId, quantity, type, reason } = await request.json();

    // トランザクションで在庫更新と履歴記録を実行
    const result = await prisma.$transaction(async (prisma) => {
      // 現在の在庫を取得
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // 新しい在庫数を計算
      const newStock = type === 'in' 
        ? product.stock + quantity 
        : product.stock - quantity;

      if (newStock < 0) {
        throw new Error('Insufficient stock');
      }

      // 在庫を更新
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      // 在庫履歴を記録
      const stockLog = await prisma.stockLog.create({
        data: {
          productId,
          quantity,
          type,
          reason,
        },
      });

      // 在庫アラート閾値をチェック
      if (newStock <= product.stockAlert) {
        await sendStockAlert({
          productName: product.name,
          currentStock: newStock,
          alertLevel: product.stockAlert,
        });
      }

      return { updatedProduct, stockLog };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}