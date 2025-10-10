import type { UserCreate, UserUpdate } from "@/dtos/user.dto";
import prisma from "@/lib/prisma";

class UserRepository {
  async createOrGetUser(userInput: UserCreate) {
    const user = await this.getUserByEmail(userInput.email);

    if (user) return user;

    return await this.createUser({
      googleId: userInput.googleId,
      email: userInput.email,
      name: userInput.name,
      picture: userInput.picture,
      verified: userInput.verified,
    });
  }

  async createUser(data: UserCreate) {
    return await prisma.user.create({
      data: {
        googleId: data.googleId,
        email: data.email,
        name: data.name,
        picture: data.picture,
        verified: data.verified || false,
      },
    });
  }

  async getUserByGoogleId(googleId: string) {
    return await prisma.user.findUnique({
      where: {
        googleId,
      },
    });
  }

  async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profiles: true,
      },
    });
  }

  async getUserByEmail(email: string, { includeProfiles = false } = {}) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profiles: includeProfiles,
      },
    });
  }

  async updateUser(userId: string, data: UserUpdate) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async deleteUserById(id: string): Promise<void> {
    await prisma.user.updateMany({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}

export const userRepository = new UserRepository();
