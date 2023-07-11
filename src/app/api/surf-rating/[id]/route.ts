import { getToken } from 'next-auth/jwt';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import SurfRating from '@/prisma/providers/SurfRating';
import { UpdateSurfRatingInputType } from '@/types/api';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
	const id = params.id;
	
	const prevValues = await new SurfRating(token.id).get(id);
	
	if (!prevValues) {
		return NextResponse.json({
			message: "No surf activity found"
		}, {
			status: 404,
		});
	}

	return NextResponse.json(prevValues, {
		status: 200,
	});
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	const id = params.id;
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

	await new SurfRating(token.id).delete(id);
	return NextResponse.json({
		message: "Surf activity deleted successfully"
	}, {
		status: 201,
	});
}

	


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
	const id = params.id;
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

    const data: UpdateSurfRatingInputType = await req.json();

    // Create a new SurfActivity entry
    await new SurfRating(token.id).update(id, data);


		return NextResponse.json({
			message: "Surf activity saved successfully"
		}, {
			status: 201,
		});
  } catch (error) {
    console.error('Error updating surf activity:', error);
		return NextResponse.json({
			message: "Internal Server Error"
		}, {
			status: 500,
		});
  }
}