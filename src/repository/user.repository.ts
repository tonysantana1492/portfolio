import type { GoogleUserData } from "@/components/auth/auth-popup";
import type { UserCreate, UserUpdate } from "@/dtos/user.dto";
import prisma from "@/lib/prisma";

class UserRepository {
  async createOrGetUser(googleUserData: GoogleUserData) {
    try {
      let user = await this.getUserByGoogleId(googleUserData.id);

      if (!user) {
        user = await this.getUserByEmail(googleUserData.email);

        if (user) {
          user = await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              googleId: googleUserData.id,
              name: googleUserData.name,
              picture: googleUserData.picture,
              verified: googleUserData.verified_email,
            },
          });
        }
      }

      if (!user) {
        user = await this.createUser({
          googleId: googleUserData.id,
          email: googleUserData.email,
          name: googleUserData.name,
          picture: googleUserData.picture,
          verified: googleUserData.verified_email,
        });
      }

      return user;
    } catch (error) {
      console.error("Error creating or getting user:", error);
      throw new Error("Failed to create or get user");
    }
  }

  async createUser(data: UserCreate) {
    try {
      return await prisma.user.create({
        data: {
          googleId: data.googleId,
          email: data.email,
          name: data.name,
          picture: data.picture,
          verified: data.verified || false,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  async getUserByGoogleId(googleId: string) {
    try {
      return await prisma.user.findUnique({
        where: {
          googleId,
        },
      });
    } catch (error) {
      throw new Error(`Failed to get user by Google ID: ${error}`);
    }
  }

  async getUserById(userId: string) {
    try {
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          profiles: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to get user: ${error}`);
    }
  }

  async getUserByEmail(email: string, { includeProfiles = false } = {}) {
    try {
      return await prisma.user.findUnique({
        where: {
          email: email,
        },
        include: {
          profiles: includeProfiles,
        },
      });
    } catch (error) {
      throw new Error(`Failed to get user: ${error}`);
    }
  }

  async updateUser(userId: string, data: UserUpdate) {
    try {
      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new Error(`Failed to update user: ${error}`);
    }
  }

  async deleteUserById(id: string): Promise<void> {
    try {
      await prisma.user.updateMany({
        where: {
          id,
        },
        data: {
          isActive: false,
        },
      });
    } catch (error) {
      throw new Error(`Failed to delete user: ${error}`);
    }
  }
}

export const userRepository = new UserRepository();
