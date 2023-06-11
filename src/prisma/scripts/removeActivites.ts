const { PrismaClient } = require("@prisma/client");

async function main() {
	const prisma = new PrismaClient();
	await prisma.surfRating.deleteMany({});
	await prisma.surfActivityUsers.deleteMany({});
	await prisma.surfActivity.deleteMany({});

	console.log("Deleted all records");
}

main();
