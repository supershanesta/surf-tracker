import prisma from '@/libs/prisma';
import { Prisma } from '@prisma/client';

interface CreateSurfActivity {
  date: string;
	users: string[];
	beach: string;
	surfRating: number;
	surfSize: number;
	surfShape: number;
  userId: string;
}

export const create = async (data: CreateSurfActivity) => {
  const { date, users, beach, surfRating, surfSize, surfShape, userId } = data;
  const createSurfActivity: Prisma.SurfActivityCreateInput = {
    date: new Date(date),
    location: { connect: { id: beach } },
    createdBy: { connect: { id: userId } },
    SurfActivityUsers: {
      create: [{
        user: { connect: { id: userId } },
      },
      ...users.map((user) => ({ user: { connect: { id: user } } }))
    ]
    },
    SurfRating: {
      create: {
        user: { connect: { id: userId } },
        rating: surfRating,
        size: surfSize,
        shape: surfShape,
      },
    },
  };
  await prisma.surfActivity.create({
    data: createSurfActivity
  });

}