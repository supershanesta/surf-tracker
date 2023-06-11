import {
  NextRequest,
  NextResponse,
} from 'next/server';

// pages/api/spots.ts
import prisma from '@/libs/prisma';
import { TaxonomyType } from '@/services/surfLine/controllers/types';

export async function GET(req: NextRequest) {
	if (!req.url) {
		return NextResponse.json({
			message: "No URL provided."
		}, {
			status: 400,
		})
	}
	const { searchParams } = new URL(req.url);
	const searchQuery = searchParams.get('searchQuery') || '';
	try {
		const locations = await prisma.location.findMany({
			where: {
				name: {
					contains: searchQuery, // Search for names containing the searchQuery
					mode: "insensitive", // Perform case-insensitive search
				},
				type: TaxonomyType.SPOT,
			},
			take: 10, // Limit the number of results to 10
		});
		return NextResponse.json({ spots: locations });
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			message: "Error occurred while getting spots"
		}, {
			status: 500,
		})
	}
}