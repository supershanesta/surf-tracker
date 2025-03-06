import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req });
  if (!token?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        surfActivity: {
          take: 1,
          select: {
            id: true,

            surfActivity: {
              select: {
                date: true,
                location: true,
                SurfRating: true,
                SurfActivityUsers: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Transform the data to match the expected format
    const transformedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      surfActivity: user.surfActivity.map((activity) => ({
        id: activity.id,
        date: activity.surfActivity.date.toISOString().split('T')[0],
        beach: activity.surfActivity.location,
        mySurfRating: activity.surfActivity.SurfRating[0],
        users: activity.surfActivity.SurfActivityUsers,
      })),
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Error occurred while fetching user profile' },
      { status: 500 }
    );
  }
}
