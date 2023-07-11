import { getToken } from 'next-auth/jwt';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

// pages/api/spots.ts
import prisma from '@/libs/prisma';
import {
  SurfActivityType,
  SurfRatingType,
} from '@/types/types';

export async function GET(req: NextRequest) {
	if (!req.url) {
		return NextResponse.json({
			message: "No URL provided."
		}, {
			status: 400,
		})
	}
  const token = await getToken({ req })
    if (!token?.id) {
      return NextResponse.json({
				message: "Unauthorized"
			}, {
				status: 401,
			});
    }

  const userId = token.id;
	const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  if (!startDate || !endDate) {
    return NextResponse.json({
      message: "Missing startDate or endDate"
    }, {
      status: 400,
    });
  }
  console.log(new Date(startDate), new Date(endDate))
	
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
      orderBy: [
        { date: 'asc' },
      ],
      select: {
        date: true,
        id: true,
        location: true,
        createdBy: true,
        SurfActivityUsers: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              }
            },
          },
        },
        SurfRating: {
          select: {
            id: true,
            rating: true,
            size: true,
            shape: true,
            user: true
          },
        },
      },
    });

    // conform to the interface
    const surfExperiencesFormatted = surfExperiences.map((surfExperience) => {
      const myRating: SurfRatingType | undefined = surfExperience.SurfRating.find((rating) => rating.user.id === userId);
      const surfActivity: SurfActivityType = {
        // pad the month and day with a 0 if needed
        id: surfExperience.id,
        date: surfExperience.date.toISOString().split('T')[0],
        beach: surfExperience.location,
        users: surfExperience.SurfActivityUsers.filter(({ user }) => user.id !== userId).map(({ user }) => user),
        surfRatings: surfExperience.SurfRating,
        mySurfRating: myRating,
        createdBy: surfExperience.createdBy,
      }
      console.log('surfActivity', surfActivity)
      return surfActivity;
    });
      


    

      return NextResponse.json(surfExperiencesFormatted);
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			message: "Error occurred while getting surf activity frequency"
		}, {
			status: 500,
		})
	}
}