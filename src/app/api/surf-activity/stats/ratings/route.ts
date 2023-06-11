import { getToken } from 'next-auth/jwt';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

// pages/api/spots.ts
import prisma from '@/libs/prisma';

interface RatingsObject {
  1: number;
  2: number;
  3: number;
  4: number;
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
		// return the count of each surf rating for the given time period for this user
    // the surfRating is another table, so we need to group by it
    // a rating can only be 1-4
    const ratings = await prisma.surfRating.groupBy({
      by: ['rating'],
      where: {
        userId: userId,
        surfActivity: {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
        },
        },
      },
      _count: true
    });

    console.log(ratings)
    // data looks like this [{ _count: 1, rating: 1 }, { _count: 1, rating: 2 }]
    // we need to convert it to this [{ one: 1, two: 1, three: 0, four: 0 }]
    // create a loop that creates an object for each rating 1 - 4
    // if the rating exists, add the count to the object
    // if the rating doesn't exist, add a 0 to the object
    const ratingsObject: RatingsObject = {1: 0, 2: 0, 3: 0, 4: 0};
    Object.entries(ratingsObject)
    .forEach(([key, value]) => {
      const rating = ratings.find(rating => rating.rating === parseInt(key));
      if (rating) {
        // @ts-ignore
        ratingsObject[key] = rating._count; 
      }
    })




		return NextResponse.json(ratingsObject);
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			message: "Error occurred while getting surf activity frequency"
		}, {
			status: 500,
		})
	}
}