import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Delete cart item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const cartItem = await prisma.cartItem.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('DELETE /api/cart/[id] error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// Update cart item quantity
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { quantity } = body;

    const cartItem = await prisma.cartItem.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        quantity,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('PATCH /api/cart/[id] error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}