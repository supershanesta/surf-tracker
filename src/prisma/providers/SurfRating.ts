import prisma from '@/libs/prisma';

interface CreateSurfRating {
  surfActivityId: string;
  surfRating: number;
  surfSize: number;
  surfShape: number;
  userId: string;
}


const create = async  (data: CreateSurfRating) => {
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
  console.log(surfRating)
  if (surfRating) {
    // update surf rating
    const updatedSurfRating = await prisma.surfRating.update({
      where: {
        id: surfRating.id
      },
      data: {
        rating: data.surfRating,
        size: data.surfSize,
        shape: data.surfShape
      }
    });
    return updatedSurfRating;
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

const deletebyActivityAndUserId = async  (id: string, userId: string) => {
  // delete surf rating
  const deletedSurfRating = await prisma.surfRating.delete({
    where: {
      surfRating_surfActivityId_userId: {
        surfActivityId: id,
        userId: userId
      }
    }
  });
  return deletedSurfRating;
}

const get = async  (id: string) => {
  const prevValues = await prisma.surfRating.findFirst({
		where: {
			id: {
        equals: id,
      }
		},
	});
	console.log(prevValues)
	return prevValues;
}

const getbyActivityAndUserId = async  (id: string, userId: string) => {
  const prevValues = await prisma.surfRating.findFirst({
		where: {
			surfActivityId: {
        equals: id,
      },
      userId: {
        equals: userId,
      }
		},
	});
	return prevValues;
}

 const SurfRating = {
  create,
  get,
  getbyActivityAndUserId,
  deletebyActivityAndUserId
}

export default SurfRating;