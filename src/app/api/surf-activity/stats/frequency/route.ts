import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// pages/api/spots.ts
import prisma from '@/libs/prisma';

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
    // return this users total number of surf activities for the given time period
    const frequency = await prisma.surfActivity.count({
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
    });

    // calculate the amount of days not surfed
    const notSurfed =
      Math.abs(new Date(startDate).getTime() - new Date(endDate).getTime()) /
        (1000 * 60 * 60 * 24) -
      frequency;

    return NextResponse.json({ surfed: frequency, notSurfed });
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
