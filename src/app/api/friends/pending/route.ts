import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requests = await prisma.friendship.findMany({
      where: {
        toUserId: token.id,
        status: 'PENDING',
      },
      include: {
        fromUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        toUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return NextResponse.json(
      { message: 'Error occurred while fetching pending requests' },
      { status: 500 }
    );
  }
}
