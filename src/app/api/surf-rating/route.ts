import { getToken } from 'next-auth/jwt';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import SurfRating from '@/prisma/providers/SurfRating';

interface CreateSurfRatingRequest {
	surfActivityId: string;
	surfRating: number;
	surfSize: number;
	surfShape: number;
}

interface GetSurfRatingByActivityAndUserIdRequest {
	surfActivityId: string;
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
	const prevValues = await SurfRating.getbyActivityAndUserId(surfActivityId, token.id);
	console.log('prevValues', prevValues)
	return NextResponse.json(prevValues, {
		status: 200,
	});
}

export async function DELETE(req: NextRequest, res: NextResponse) {
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

	await SurfRating.deletebyActivityAndUserId(surfActivityId, token.id);
	return NextResponse.json({
		message: "Surf activity deleted successfully"
	}, {
		status: 201,
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
    const data: CreateSurfRatingRequest = await req.json();
		
		console.log('DATA', data)

    // Create a new SurfActivity entry
    await SurfRating.create({
      ...data,
			userId,
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