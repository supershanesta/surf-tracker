import prisma from '@/libs/prisma';
import {
  CreateSurfActivityInputType,
  UpdateSurfActivityInputType,
} from '@/types/api';
import { SurfActivityType, UserType } from '@/types/types';
import { Prisma, User } from '@prisma/client';

import Provider from './provider';

const mapPrismaUserToUserType = (
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'image'>
): UserType => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  image: user.image || undefined,
});

class SurfActivity extends Provider {
  async get(id: string): Promise<SurfActivityType | null> {
    try {
      // return the count of each beach for the given time period for this user

      const surfExperience = await prisma.surfActivity.findUnique({
        where: { id },
        select: {
          date: true,
          id: true,
          location: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
            },
          },
          SurfActivityUsers: {
            select: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          SurfRating: {
            select: {
              id: true,
              notes: true,
              rating: true,
              size: true,
              shape: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      // conform to the interface
      if (!surfExperience) {
        return null;
      }
      const myRating = surfExperience.SurfRating.find(
        ({ user }) => user.id === this.userId
      );
      const surfActivity: SurfActivityType = {
        // pad the month and day with a 0 if needed
        id: surfExperience.id,
        date: surfExperience.date.toISOString().split('T')[0],
        beach: surfExperience.location,
        users: surfExperience.SurfActivityUsers.filter(
          ({ user }) => user.id !== this.userId
        ).map(({ user }) => mapPrismaUserToUserType(user)),
        surfRatings: surfExperience.SurfRating.map((rating) => ({
          ...rating,
          user: mapPrismaUserToUserType(rating.user),
        })),
        mySurfRating: myRating
          ? {
              ...myRating,
              user: mapPrismaUserToUserType(myRating.user),
            }
          : undefined,
        createdBy: mapPrismaUserToUserType(surfExperience.createdBy),
      };

      return surfActivity;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }

  async getbyActivityAndUserId(id: string) {
    const surfActivity = await prisma.surfActivity.findUnique({
      where: { id },
      include: {
        location: true,
        SurfActivityUsers: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
              },
            },
          },
        },
        SurfRating: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
              },
            },
          },
          where: {
            user: {
              id: this.userId,
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (surfActivity) {
      const result: SurfActivityType = {
        id: surfActivity.id,
        date: surfActivity.date.toISOString().split('T')[0],
        users: surfActivity.SurfActivityUsers.map(({ user }) =>
          mapPrismaUserToUserType(user)
        ),
        beach: {
          id: surfActivity.location.id,
          name: surfActivity.location.name,
          type: surfActivity.location.type,
          city: surfActivity?.location?.city,
          state: surfActivity?.location?.state,
          zip: surfActivity.location.zip,
          country: surfActivity.location.country,
        },
        surfRatings: surfActivity.SurfRating.map((rating) => ({
          ...rating,
          user: mapPrismaUserToUserType(rating.user),
        })),
        mySurfRating: surfActivity.SurfRating.find(
          (surfRating) => surfRating.user.id === this.userId
        )
          ? {
              ...surfActivity.SurfRating.find(
                (surfRating) => surfRating.user.id === this.userId
              )!,
              user: mapPrismaUserToUserType(
                surfActivity.SurfRating.find(
                  (surfRating) => surfRating.user.id === this.userId
                )!.user
              ),
            }
          : undefined,
        createdBy: mapPrismaUserToUserType(surfActivity.createdBy),
      };
      return result;
    }
    return null;
  }

  async create(data: CreateSurfActivityInputType) {
    const { date, users, beach, surfRating } = data;
    const createSurfActivity: Prisma.SurfActivityCreateInput = {
      date: new Date(date),
      location: { connect: { id: beach } },
      createdBy: { connect: { id: this.userId } },
      SurfActivityUsers: {
        create: [
          {
            user: { connect: { id: this.userId } },
          },
          ...users.map((user) => ({ user: { connect: { id: user } } })),
        ],
      },
      SurfRating: {
        create: {
          user: { connect: { id: this.userId } },
          ...surfRating,
        },
      },
    };
    const activity = await prisma.surfActivity.create({
      data: createSurfActivity,
    });
    if (activity) {
      return this.get(activity.id);
    }
    return null;
  }

  async update(id: string, data: UpdateSurfActivityInputType) {
    const { date, users, beach } = data;
    const updateSurfActivity: Prisma.SurfActivityUpdateInput = {
      date: new Date(date),
      location: { connect: { id: beach } },
      SurfActivityUsers: {
        create: [],
      },
    };
    // Check if users are provided and not already connected
    if (users && users.length > 0) {
      const connectedUsers = await prisma.surfActivity.findUnique({
        where: { id },
        include: { SurfActivityUsers: true },
      });
      //.then((activity) => activity?.SurfActivityUsers.map((sau) => sau.userId) ?? []);
      const connectedUserIds =
        connectedUsers?.SurfActivityUsers.map((user) => user.userId) || [];
      const newUsers = users.filter((user) => !connectedUserIds.includes(user));
      const removeUsers =
        connectedUsers?.SurfActivityUsers.filter(
          (user) => !users.includes(user.userId) && user.userId !== this.userId
        ) || [];
      if (updateSurfActivity.SurfActivityUsers) {
        updateSurfActivity.SurfActivityUsers.create = newUsers.map((user) => ({
          user: { connect: { id: user } },
        }));
        updateSurfActivity.SurfActivityUsers.delete = removeUsers.map(
          (user) => ({
            id: user.id,
          })
        );
      }
    }
    await prisma.surfActivity.update({
      where: {
        id,
      },
      data: updateSurfActivity,
    });
    return this.get(id);
  }

  async delete(id: string) {
    await prisma.surfActivity.delete({
      where: {
        id,
      },
    });
  }
}

export default SurfActivity;
