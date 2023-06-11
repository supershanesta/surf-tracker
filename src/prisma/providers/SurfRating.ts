import { PrismaClient } from '@prisma/client';

interface CreateSurfRating {
  surfActivityId: string;
  surfRating: number;
  surfSize: number;
  surfShape: number;
  userId: string;
}


export const create = async  (data: CreateSurfRating) => {
  const prisma = new PrismaClient();
  // check surf activity id in database
  // if not found, throw error
  const surfActivity = await prisma.surfActivity.findUnique({
    where: {
      id: data.surfActivityId
    }
  })
  if (!surfActivity) {
    throw new Error('Surf Activity not found');
  }

  // check if user is part of surf activity
  // if not found, throw error
  const surfActivityUser = await prisma.surfActivityUsers.findUnique({
    where: {
      surfActivityUsers_surfActivityId_userId: {
        surfActivityId: data.surfActivityId,
        userId: data.userId
      }
    }
  })
  if (!surfActivityUser) {
    throw new Error('User is not part of this surf activity');
  }

  // check if user has already rated this surf activity
  // if found, throw error
  const surfRating = await prisma.surfRating.findUnique({
    where: {
      surfRating_surfActivityId_userId: {
        surfActivityId: data.surfActivityId,
        userId: data.userId
      }
    }
  })
  if (surfRating) {
    throw new Error('User has already rated this surf activity');
  }

  // create surf rating
  const newSurfRating = await prisma.surfRating.create({
    data: {
      surfActivityId: data.surfActivityId,
      rating: data.surfRating,
      size: data.surfSize,
      shape: data.surfShape,
      userId: data.userId
    }
  })

  // return surf rating
  return newSurfRating;
}