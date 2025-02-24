import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { friendId: string } }
) {
  const token = await getToken({ req });
  if (!token?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // First verify this is actually a friend
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { fromUserId: token.id, toUserId: params.friendId },
          { fromUserId: params.friendId, toUserId: token.id },
        ],
        status: 'ACCEPTED',
      },
    });

    if (!friendship) {
      return NextResponse.json(
        { message: "Not authorized to view this user's activities" },
        { status: 403 }
      );
    }

    const activities = await prisma.surfActivity.findMany({
      where: {
        SurfActivityUsers: {
          some: {
            userId: params.friendId,
          },
        },
      },
      include: {
        location: true,
        createdBy: true,
        SurfActivityUsers: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        SurfRating: {
          where: {
            userId: params.friendId,
          },
          select: {
            id: true,
            notes: true,
            rating: true,
            size: true,
            shape: true,
            user: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Format the response to match SurfActivityType
    const formattedActivities = activities.map((activity) => ({
      id: activity.id,
      date: activity.date.toISOString().split('T')[0],
      beach: activity.location,
      users: activity.SurfActivityUsers.map((sau) => sau.user),
      surfRatings: activity.SurfRating,
      mySurfRating: activity.SurfRating[0], // Friend's rating
      createdBy: activity.createdBy,
    }));

    return NextResponse.json(formattedActivities);
  } catch (error) {
    console.error("Error fetching friend's activities:", error);
    return NextResponse.json(
      { message: 'Error occurred while fetching activities' },
      { status: 500 }
    );
  }
}
