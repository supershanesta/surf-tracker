import { UserlessProvider } from './provider';

class UserProvider extends UserlessProvider {
  
  
  async get(id: string) {
    const prevValues = await this.prisma.surfRating.findFirst({
      where: {
        id: {
          equals: id,
        }
      },
    });
    console.log(prevValues)
    return prevValues;
  }
  
  async getByFirstName(firstName: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        firstName: {
          contains: firstName,
          mode: 'insensitive',
        },
      },
    });
    return user;
  }
}




export default UserProvider;