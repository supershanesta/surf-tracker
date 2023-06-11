const { PrismaClient } = require("@prisma/client");

// add users to database
const users = [
	{
		firstName: "Mike",
		lastName: "Lein",
		email: "mlein@transcend-consult.com",
		phoneNumber: "7148214969",
		password: "surf",
	},
	{
		firstName: "James",
		lastName: "Desmond",
		email: "jamespdesmond96@gmail.com",
		phoneNumber: "7143654182",
		password: "surf",
	},
	{
		firstName: "Shane",
		lastName: "Rice",
		email: "shanerice17@gmail.com",
		phoneNumber: "5626373725",
		password: "super01",
		admin: true,
	},
];

async function main() {
	const prisma = new PrismaClient();
	for (const user of users) {
		await prisma.user.upsert({
			where: {
				email: user.email,
			},
			update: {
				firstName: user.firstName,
				lastName: user.lastName,
				phoneNumber: user.phoneNumber,
				password: user.password,
				admin: user.admin,
			},
			create: {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phoneNumber: user.phoneNumber,
				password: user.password,
				admin: user.admin,
			},
		});
	}
	console.log("Users added to database");
}

main();
