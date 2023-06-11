import { getToken } from 'next-auth/jwt';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

// pages/api/spots.ts
import prisma from '@/libs/prisma';

interface SurfActivity {  
    date: string;
    beach: string;
    surfRating: number;
    surfSize: number;
    surfShape: number;
}

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
        SurfRating: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        date: true,
        location: {
          select: {
            name: true,
          },
        },
        SurfRating: {
          select: {
            rating: true,
            size: true,
            shape: true,
          },
        },
      },
    });

    // conform to the interface
    const surfExperiencesFormatted = surfExperiences.map((surfExperience) => {
        let rating = 0;
        let size = 0;
        let shape = 0;
      if (surfExperience.SurfRating.length > 0) {
        rating = surfExperience.SurfRating[0].rating;
        size = surfExperience.SurfRating[0].size;
        shape = surfExperience.SurfRating[0].shape;
      }
      const surfActivity: SurfActivity = {
        // pad the month and day with a 0 if needed
        date: surfExperience.date.getFullYear() + '-' + (surfExperience.date.getMonth() + 1).toString().padStart(2, '0') + '-' + surfExperience.date.getDate().toString().padStart(2, '0'),
        beach: surfExperience.location.name,
        surfRating: rating,
        surfSize: size,
        surfShape: shape,
      }
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