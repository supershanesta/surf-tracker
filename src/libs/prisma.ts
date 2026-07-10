// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const isProduction = process.env.NODE_ENV === 'production';

const prismaClientOptions = isProduction
  ? { log: ['warn', 'error'] as ('warn' | 'error')[] }
  : { log: ['error'] as 'error'[] };

let prisma: PrismaClient;

if (isProduction) {
  prisma = new PrismaClient(prismaClientOptions);
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(prismaClientOptions);
  }
  prisma = global.prisma;
}

if (!isProduction) {
  // @ts-ignore
  prisma.$on('query', (e) => {
    // @ts-ignore
    console.log('Query: ' + e.query);
    // @ts-ignore
    console.log('Params: ' + e.params);
    // @ts-ignore
    console.log('Duration: ' + e.duration + 'ms');
  });
}

export default prisma;
