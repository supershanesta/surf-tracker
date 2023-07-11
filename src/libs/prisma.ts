// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient({log: ['query', 'info', 'warn', 'error']});
} else {
	// @ts-ignore
	if (!global.prisma) {
		// @ts-ignore
		global.prisma = new PrismaClient({log: ['error']});
	}
	// @ts-ignore
	prisma = global.prisma;
}
// @ts-ignore
prisma.$on('query', (e) => { 
	// @ts-ignore
  console.log('Query: ' + e.query)
	// @ts-ignore
  console.log('Params: ' + e.params)
	// @ts-ignore
  console.log('Duration: ' + e.duration + 'ms')
})

export default prisma;
