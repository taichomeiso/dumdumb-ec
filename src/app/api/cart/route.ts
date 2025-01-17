import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';

// カート情報を取得するGETメソッド
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.id) {
      // ログインユーザーのカートを取得
      const cartItems = await prisma.cartItem.findMany({
        where: { userId: session.user.id },
        include: { product: true },
      });
      return NextResponse.json(cartItems);
    } else {
      // ゲストユーザーのカートを取得
      const cookieStore = cookies();
      const guestId = cookieStore.get('guestId')?.value;
      
      if (!guestId) {
        return NextResponse.json([]); // カートが空の場合は空配列を返す
      }

      const cartItems = await prisma.cartItem.findMany({
        where: { guestUserId: guestId },
        include: { product: true },
      });
      return NextResponse.json(cartItems);
    }
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json(
      { error: 'カート情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// カートに商品を追加するPOSTメソッド
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    if (!body.productId || !body.quantity) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      );
    }

    // 商品の存在確認
    const product = await prisma.product.findUnique({
      where: { id: body.productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: '商品が見つかりません' },
        { status: 404 }
      );
    }

    let cartItem;
    if (session?.user?.id) {
      // ログインユーザーの場合
      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          userId: session.user.id,
          productId: body.productId,
          size: body.size || null,
        },
      });

      if (existingCartItem) {
        cartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + body.quantity },
          include: { product: true },
        });
      } else {
        cartItem = await prisma.cartItem.create({
          data: {
            userId: session.user.id,
            productId: body.productId,
            quantity: body.quantity,
            size: body.size || null,
          },
          include: { product: true },
        });
      }
    } else {
      // ゲストユーザーの場合
      const cookieStore = cookies();
      let guestId = cookieStore.get('guestId')?.value;

      // ゲストIDがない場合は新規作成
      if (!guestId) {
        const guestUser = await prisma.guestUser.create({
          data: {}
        });
        guestId = guestUser.id;
        cookies().set('guestId', guestId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }

      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          guestUserId: guestId,
          productId: body.productId,
          size: body.size || null,
        },
      });

      if (existingCartItem) {
        cartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + body.quantity },
          include: { product: true },
        });
      } else {
        cartItem = await prisma.cartItem.create({
          data: {
            guestUserId: guestId,
            productId: body.productId,
            quantity: body.quantity,
            size: body.size || null,
          },
          include: { product: true },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'カートに追加しました',
      cartItem: cartItem
    });

  } catch (error) {
    console.error('Error creating cart item:', error);
    return NextResponse.json(
      { error: 'カートへの追加に失敗しました' },
      { status: 500 }
    );
  }
}

// カート内の商品を削除するDELETEメソッド
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'カートアイテムIDが必要です' },
        { status: 400 }
      );
    }

    if (session?.user?.id) {
      await prisma.cartItem.delete({
        where: {
          id: id,
          userId: session.user.id,
        },
      });
    } else {
      const cookieStore = cookies();
      const guestId = cookieStore.get('guestId')?.value;
      
      if (guestId) {
        await prisma.cartItem.delete({
          where: {
            id: id,
            guestUserId: guestId,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { error: 'カートからの削除に失敗しました' },
      { status: 500 }
    );
  }
}