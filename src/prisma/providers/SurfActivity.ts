import prisma from '@/libs/prisma';
import {
  Location,
  Prisma,
  User,
} from '@prisma/client';

interface CreateSurfActivity {
  date: string;
	users: string[];
	beach: string;
	surfRating: SurfRating;
  userId: string;
}

interface SurfRating {
  id?: string;
  surfRating: number;
	surfSize: number;
	surfShape: number;
}

interface SurfActivity {
  id: string;
  date: string;
  users: User[];
  beach: Location;
  surfRating?: SurfRating
  createdBy: string;
}

export const getbyActivityAndUserId = async (id: string, userId: string) => {
  const surfActivity = await prisma.surfActivity.findUnique({
    where: {
      id,
    },
    include: {
      location: true,
      SurfActivityUsers: {
        include: {
          user: true,
        }
      },
      SurfRating: {
        where: {
          user: {
            id: userId,
          },
        },
      },
      createdBy: true,
    },
  });
  // parse data
  const result: Partial<SurfActivity> = {};
  if (surfActivity) {
    result.id = surfActivity.id;
    result.date = surfActivity.date.toISOString();
    result.users = surfActivity.SurfActivityUsers.map((surfActivityUser) => surfActivityUser.user);
    result.beach = surfActivity.location;
    if (surfActivity.SurfRating.length === 1) {
      result.surfRating = { 
        id: surfActivity.SurfRating[0].id,
        surfRating: surfActivity.SurfRating[0].rating,
        surfSize: surfActivity.SurfRating[0].size,
        surfShape: surfActivity.SurfRating[0].shape,
      };
    }
    result.createdBy = surfActivity.createdBy.id;
  }
  console.log(surfActivity)
  return result;
}

export const create = async (data: CreateSurfActivity) => {
  const { date, users, beach, surfRating, userId } = data;
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
        rating: surfRating.surfRating,
        size: surfRating.surfSize,
        shape: surfRating.surfShape,
      },
    },
  };
  await prisma.surfActivity.create({
    data: createSurfActivity
  });

}