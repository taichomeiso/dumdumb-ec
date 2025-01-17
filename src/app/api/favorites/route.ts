import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// お気に入り一覧を取得
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        favorites: true
      }
    });

    return NextResponse.json(user?.favorites || []);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'お気に入りの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// お気に入りに追加/削除
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: '商品IDが必要です' }, { status: 400 });
    }

    // 現在のお気に入り状態を確認
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        favorites: {
          where: { id: productId }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    let message;
    let isFavorite;

    if (user.favorites.length > 0) {
      // お気に入りから削除
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          favorites: {
            disconnect: { id: productId }
          }
        }
      });
      message = 'お気に入りから削除しました';
      isFavorite = false;
    } else {
      // お気に入りに追加
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          favorites: {
            connect: { id: productId }
          }
        }
      });
      message = 'お気に入りに追加しました';
      isFavorite = true;
    }

    // 更新後のお気に入り数を返す
    const updatedFavorites = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        favorites: true
      }
    });

    return NextResponse.json({
      success: true,
      message,
      count: updatedFavorites?.favorites.length || 0,
      isFavorite
    });

  } catch (error) {
    console.error('Error updating favorites:', error);
    return NextResponse.json(
      { error: 'お気に入りの更新に失敗しました' },
      { status: 500 }
    );
  }
}