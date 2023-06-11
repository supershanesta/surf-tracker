// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient(
		{ 
			log: [
				{
					emit: "event",
					level: "query",
				},
			],
		}
	);
	prisma.$on("query", async (e) => {
    console.log(`${e.query} ${e.params}`)
});
} else {
	// @ts-ignore
	if (!global.prisma) {
		// @ts-ignore
		global.prisma = new PrismaClient(
			{ 
				log: [
					{
						emit: "event",
						level: "query",
					},
				],
			}
		);
		global.prisma.$on("query", async (e) => {
			console.log(`${e.query} ${e.params}`)
		});
	}
	// @ts-ignore
	prisma = global.prisma;
}

export default prisma;
