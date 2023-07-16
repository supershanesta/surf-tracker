import { UserlessProvider } from './provider';

class LocationProvider extends UserlessProvider {
  
  async getByName(name: string) {
    const user = await this.prisma.location.findFirst({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
    return user;
  }
}

export default LocationProvider;