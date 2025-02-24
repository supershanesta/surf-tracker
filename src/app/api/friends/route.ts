import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  //test

  try {
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [{ fromUserId: token.id }, { toUserId: token.id }],
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

    return NextResponse.json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json(
      { message: 'Error occurred while fetching friends' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { toUserId } = await req.json();

    // Validate that we're not trying to friend ourselves
    if (token.id === toUserId) {
      return NextResponse.json(
        { message: 'Cannot send friend request to yourself' },
        { status: 400 }
      );
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { fromUserId: token.id, toUserId },
          { fromUserId: toUserId, toUserId: token.id },
        ],
      },
    });

    if (existingFriendship) {
      return NextResponse.json(
        { message: 'Friendship request already exists' },
        { status: 400 }
      );
    }

    // Create new friendship request
    const friendship = await prisma.friendship.create({
      data: {
        fromUserId: token.id,
        toUserId,
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

    return NextResponse.json({ friendship });
  } catch (error) {
    console.error('Error creating friend request:', error);
    return NextResponse.json(
      { message: 'Error occurred while creating friend request' },
      { status: 500 }
    );
  }
}
