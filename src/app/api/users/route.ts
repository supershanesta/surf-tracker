import { getToken } from 'next-auth/jwt';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

// pages/api/users.ts
import prisma from '@/libs/prisma';

export async function GET(req: NextRequest) {
	if (!req.url) {
		return NextResponse.json({
			message: "No URL provided."
		}, {
			status: 400,
		})
	}
	const session = await getToken({ req });
	console.log(session);
	const { searchParams } = new URL(req.url);
	const searchQuery = searchParams.get('searchQuery') || '';
	try {
		const users = await prisma.user.findMany({
			where: {
				firstName: {
					contains: searchQuery, // Search for names containing the searchQuery
					mode: "insensitive", // Perform case-insensitive search
				},
				id: {
					not: session?.id
				}
			},
			take: 10, // Limit the number of results to 10
		});
		return NextResponse.json({ users });
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			message: "Error occurred while getting users"
		}, {
			status: 500,
		})
	}
}