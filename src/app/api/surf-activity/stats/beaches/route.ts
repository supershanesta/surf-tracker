import { getToken } from 'next-auth/jwt';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

// pages/api/spots.ts
import prisma from '@/libs/prisma';

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

    const locationIds = await prisma.surfActivity.groupBy({
      by: ['locationId'],
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
      _count: true
    });

  
    const locationData = await prisma.location.findMany({
      where: {
        id: {
          in: locationIds.map((l) => l.locationId),
        },
      },
    });

    const beachCount = locationIds.map((b) => {
      const beach = locationData.find((beach) => beach.id === b.locationId);
      return {
        id: beach?.id,
        name: beach?.name,
        count: b._count,
      };
    });

    


		return NextResponse.json(beachCount);
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			message: "Error occurred while getting surf activity frequency"
		}, {
			status: 500,
		})
	}
}