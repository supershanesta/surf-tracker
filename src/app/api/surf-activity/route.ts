import { getToken } from 'next-auth/jwt';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

// pages/api/spots.ts
import {
  create,
  getbyActivityAndUserId,
} from '@/prisma/providers/SurfActivity';

interface CreateSurfRatingRequest {
	surfRating: number;
	surfSize: number;
	surfShape: number;
}
interface CreateSurfActivityRequest {
	date: string;
	users: string[];
	beach: string;
	surfRating: CreateSurfRatingRequest
}

export async function GET(req: NextRequest, res: NextResponse) {
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
	const { searchParams } = new URL(req.url);
	const surfActivityId = searchParams.get('surfActivityId');
	if (!surfActivityId) {
		return NextResponse.json({
			message: "Missing surfActivityId"
		}, {
			status: 400,
		});
	}
	const prevValues = await getbyActivityAndUserId(surfActivityId, token.id);
	console.log('prevValues', prevValues)
	return NextResponse.json(prevValues, {
		status: 200,
	});
}

export async function POST(req: NextRequest, res: NextResponse) {
	if (!req.url) {
		return NextResponse.json({
			message: "No URL provided."
		}, {
			status: 400,
		})
	}
	
	try {
		
		const token = await getToken({ req })
    if (!token?.id) {
      return NextResponse.json({
				message: "Unauthorized"
			}, {
				status: 401,
			});
    }

    const userId = token.id;
    const data: CreateSurfActivityRequest = await req.json();
		
		
		await create({
			...data,
			userId
		});

		return NextResponse.json({
			message: "Surf activity saved successfully"
		}, {
			status: 201,
		});
  } catch (error) {
    console.error('Error creating surf activity:', error);
		return NextResponse.json({
			message: "Internal Server Error"
		}, {
			status: 500,
		});
  }
}