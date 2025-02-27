import {
  CreateSurfRatingInputType,
  UpdateSurfRatingInputType,
} from '@/types/api';

import Provider from './provider';

class SurfRating extends Provider {
  async create(data: CreateSurfRatingInputType) {
    // check surf activity id in database
    // if not found, throw error
    const surfActivity = await this.prisma.surfActivity.findUnique({
      where: {
        id: data.surfActivityId,
      },
    });
    if (!surfActivity) {
      throw new Error('Surf Activity not found');
    }

    // check if user is part of surf activity
    // if not found, throw error
    const surfActivityUser = await this.prisma.surfActivityUsers.findUnique({
      where: {
        surfActivityUsers_surfActivityId_userId: {
          surfActivityId: data.surfActivityId,
          userId: this.userId,
        },
      },
    });
    if (!surfActivityUser) {
      throw new Error('User is not part of this surf activity');
    }

    // check if user has already rated this surf activity
    // if found, throw error
    const surfRating = await this.prisma.surfRating.findUnique({
      where: {
        surfRating_surfActivityId_userId: {
          surfActivityId: data.surfActivityId,
          userId: this.userId,
        },
      },
    });

    if (surfRating) {
      // update surf rating
      const updatedSurfRating = await this.prisma.surfRating.update({
        where: {
          id: surfRating.id,
        },
        data: {
          notes: data.notes,
          rating: data.rating,
          size: data.size,
          shape: data.shape,
        },
      });
      return updatedSurfRating;
    }

    // create surf rating
    const newSurfRating = await this.prisma.surfRating.create({
      data: {
        ...data,
        userId: this.userId,
      },
    });

    // return surf rating
    return newSurfRating;
  }

  async delete(id: string) {
    // delete surf rating
    const deletedSurfRating = await this.prisma.surfRating.delete({
      where: {
        id: id,
      },
    });
    return deletedSurfRating;
  }

  async deletebyActivityAndUserId(id: string) {
    // delete surf rating
    const deletedSurfRating = await this.prisma.surfRating.delete({
      where: {
        surfRating_surfActivityId_userId: {
          surfActivityId: id,
          userId: this.userId,
        },
      },
    });
    return deletedSurfRating;
  }

  async get(id: string) {
    const prevValues = await this.prisma.surfRating.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
    });
    return prevValues;
  }

  async getbyActivityAndUserId(id: string) {
    const prevValues = await this.prisma.surfRating.findFirst({
      where: {
        surfActivityId: {
          equals: id,
        },
        userId: {
          equals: this.userId,
        },
      },
    });
    return prevValues;
  }

  async update(id: string, data: UpdateSurfRatingInputType) {
    await this.prisma.surfRating.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });
  }
}

export default SurfRating;
