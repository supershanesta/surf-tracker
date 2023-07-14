import { getToken } from 'next-auth/jwt';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import SurfActivity from '@/prisma/providers/SurfActivity';
import { UpdateSurfActivityInputType } from '@/types/api';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

  const userId = token.id;
  try {
    const surfActivity = await new SurfActivity(userId).get(id);
    return NextResponse.json(surfActivity);
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			message: "Error occurred while getting surf activity frequency"
		}, {
			status: 500,
		})
	}
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
    const surfActivityProvider = new SurfActivity(token.id)
    const surfActivityFound = await surfActivityProvider.get(id);
    if (!surfActivityFound) {
      return NextResponse.json({
        message: "Surf activity not found"
      }, {
        status: 404,
      });
    }
    const data: UpdateSurfActivityInputType = await req.json();
    const updatedActivity = await surfActivityProvider.update(id, data);
    console.log(updatedActivity);
    
		

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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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
		const surfActivityProvider = new SurfActivity(token.id)
		const surfActivityFound = await surfActivityProvider.get(id);
		if (!surfActivityFound) {
			return NextResponse.json({
				message: "Surf activity not found"
			}, {
				status: 404,
			});
		}
		await surfActivityProvider.delete(id);
		return NextResponse.json({
			message: "Surf activity deleted successfully"
		}, {
			status: 200,
		});
	}
	catch (error) {
		console.error('Error deleting surf activity:', error);
		return NextResponse.json({
			message: "Internal Server Error"
		}, {
			status: 500,
		});
	}
}