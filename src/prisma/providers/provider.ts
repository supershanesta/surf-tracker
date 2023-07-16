import prisma from '@/libs/prisma';
import { PrismaClient } from '@prisma/client';

export default class Provider {
    userId: string;
    prisma: PrismaClient;

    constructor(userId: string) {
        this.userId = userId;
        this.prisma = prisma;
    }
}

export class UserlessProvider {
    prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }
}