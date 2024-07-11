import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { UserProfileInput } from '../interfaces/interfaces';

const prisma = new PrismaClient();

export const userService = {
  async createUser(email: string, password: string, role: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });
  },

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async updateUser(id: string, data: { email?: string; password?: string }) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  async updateUserProfile (userId: string, profileInput: UserProfileInput){
    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: {
        ...profileInput,
        updatedAt: new Date(),
      },
      create: {
        ...profileInput,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return updatedProfile;
  },

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },

  async verifyPassword(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return false;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid;
  },

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },
};
