import { Prisma, UserlessProvider } from './provider';

class ForcastProvider extends UserlessProvider {
  async create(data: Prisma.ForcastCreateInput) {
    try {
      const forcast = await this.prisma.forcast.create({
        data,
      });
      return forcast;
    } catch (error) {}
  }
}

export default ForcastProvider;
