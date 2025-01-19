import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: { favorites: true }
        }
      }
    });

    return NextResponse.json({ count: user?._count.favorites || 0 });
  } catch (error) {
    console.error('Error fetching favorites count:', error);
    return NextResponse.json({ count: 0 });
  }
}