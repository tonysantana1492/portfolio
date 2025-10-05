import type { GoogleUserData } from "@/components/auth/auth-popup";
import prisma from "@/lib/prisma";

export interface CreateUserData {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  verified?: boolean;
}

export async function createOrGetUser(googleUserData: GoogleUserData) {
  try {
    let user = await prisma.user.findUnique({
      where: {
        googleId: googleUserData.id,
      },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: {
          email: googleUserData.email,
        },
      });

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
      user = await prisma.user.create({
        data: {
          googleId: googleUserData.id,
          email: googleUserData.email,
          name: googleUserData.name,
          picture: googleUserData.picture,
          verified: googleUserData.verified_email,
        },
      });
    }

    return user;
  } catch (error) {
    console.error("Error creating or getting user:", error);
    throw new Error("Failed to create or get user");
  }
}

export async function getUserById(userId: string) {
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
    console.error("Error getting user by ID:", error);
    throw new Error("Failed to get user");
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        profiles: true,
      },
    });
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw new Error("Failed to get user");
  }
}

export async function updateUser(
  userId: string,
  data: Partial<CreateUserData>
) {
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
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}
