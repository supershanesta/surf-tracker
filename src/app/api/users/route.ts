import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const recentSessions = await prisma.surfActivity.findMany({
      orderBy: {
        date: 'desc' as const,
      },
      take: 20,
      include: {
        location: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
        SurfRating: {
          where: {
            userId: token.id,
          },
          take: 1,
        },
      },
    });

    const transformedSessions = recentSessions.map((session) => ({
      id: session.id,
      date: session.date.toISOString().split('T')[0],
      beach: session.location,
      user: session.createdBy,
      mySurfRating: session.SurfRating[0],
    }));

    return NextResponse.json(transformedSessions);
  } catch (error) {
    console.error('Error fetching recent sessions:', error);
    return NextResponse.json(
      { message: 'Error occurred while fetching recent sessions' },
      { status: 500 }
    );
  }
}
