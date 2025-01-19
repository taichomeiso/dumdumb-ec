import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Props) {
  if (!params?.id) {
    return NextResponse.json(
      { error: '商品IDが指定されていません' },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: '商品が見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { error: '商品の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Props) {
  if (!params?.id) {
    return NextResponse.json(
      { error: '商品IDが指定されていません' },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      { error: '商品の削除に失敗しました' },
      { status: 500 }
    );
  }
}
