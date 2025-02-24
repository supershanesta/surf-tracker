import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  const token = await getToken({ req });
  if (!token?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        id: params.requestId,
      },
    });

    if (!existingFriendship) {
      return NextResponse.json(
        { message: 'Friendship request does not exist' },
        { status: 400 }
      );
    }

    if (existingFriendship.status !== 'PENDING') {
      return NextResponse.json(
        { message: 'Friendship request is not pending' },
        { status: 400 }
      );
    }

    if (existingFriendship.toUserId !== token.id) {
      return NextResponse.json(
        { message: 'Friendship request is not for you' },
        { status: 400 }
      );
    }

    // Create new friendship request
    const friendship = await prisma.friendship.update({
      where: { id: existingFriendship.id },
      data: {
        status: 'ACCEPTED',
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

    return NextResponse.json({ friendship });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return NextResponse.json(
      { message: 'Error occurred while accepting friend request' },
      { status: 500 }
    );
  }
}
