import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// pages/api/spots.ts
import prisma from '@/libs/prisma';
import { SurfActivityType, SurfRatingType } from '@/types/types';

export async function GET(req: NextRequest) {
  if (!req.url) {
    return NextResponse.json(
      {
        message: 'No URL provided.',
      },
      {
        status: 400,
      }
    );
  }
  const token = await getToken({ req });
  if (!token?.id) {
    return NextResponse.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }

  const userId = token.id;
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  if (!startDate || !endDate) {
    return NextResponse.json(
      {
        message: 'Missing startDate or endDate',
      },
      {
        status: 400,
      }
    );
  }

  try {
    // return the count of each beach for the given time period for this user

    const surfExperiences = await prisma.surfActivity.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        SurfActivityUsers: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: [{ date: 'asc' }],
      select: {
        date: true,
        id: true,
        location: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        SurfActivityUsers: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
          },
        },
        SurfRating: {
          select: {
            id: true,
            notes: true,
            rating: true,
            size: true,
            shape: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Transform user data to match UserType interface
    const transformUser = (user: any) => ({
      ...user,
      image: user.image || undefined,
    });

    // conform to the interface
    const surfExperiencesFormatted = surfExperiences.map((surfExperience) => {
      const rawMyRating = surfExperience.SurfRating.find(
        (rating) => rating.user.id === userId
      );
      const myRating: SurfRatingType | undefined = rawMyRating
        ? {
            ...rawMyRating,
            user: transformUser(rawMyRating.user),
          }
        : undefined;

      const surfActivity: SurfActivityType = {
        // pad the month and day with a 0 if needed
        id: surfExperience.id,
        date: surfExperience.date.toISOString().split('T')[0],
        beach: surfExperience.location,
        users: surfExperience.SurfActivityUsers.filter(
          ({ user }) => user.id !== userId
        ).map(({ user }) => transformUser(user)),
        surfRatings: surfExperience.SurfRating.map((rating) => ({
          ...rating,
          user: transformUser(rating.user),
        })),
        mySurfRating: myRating,
        createdBy: transformUser(surfExperience.createdBy),
      };
      return surfActivity;
    });

    return NextResponse.json(surfExperiencesFormatted);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: 'Error occurred while getting surf activity frequency',
      },
      {
        status: 500,
      }
    );
  }
}
