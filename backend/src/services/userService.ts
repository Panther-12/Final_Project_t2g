import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { UserProfileInput } from '../interfaces/interfaces';
import { generatePasswordResetCode } from '../utils/passwordUtils';
import { sendPasswordResetEmail } from '../utils/emailUtils';

const prisma = new PrismaClient();

export const userService = {
  async createUser(firstName: string, lastName: string, email: string, password: string, role: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser =  await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });
    await prisma.profile.create({
      data: {
        firstName,
        lastName,
        userId: newuser.id
      }
    })
    return newuser
  },

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
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

  async deactivateUser(id: string) {
    let message: string = ''
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.role === 'admin') {
      message = 'Cannot deactivate an admin user'
      return {message: message}
    }
    return prisma.user.update({
      where: { id },
      data: {
        accountStatus: 'deactivated',
      },
    });
  },

  async activateUser(id: string) {
    let message: string = ''
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.role === 'admin') {
      message = 'User is an admin'
      return {message: message}
    }
    return prisma.user.update({
      where: { id },
      data: {
        accountStatus: 'activated',
      },
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

  async assignRoleOrganizer(id: string) {
    let message: string = ''
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.role === 'admin') {
      message = 'Cannot change role of an admin user'
      return { message: message}
    }
    return prisma.user.update({
      where: { id },
      data: {
        role: 'organizer',
      },
    });
  },

  async assignRoleAdmin(id: string) {
    let message: string = ''
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.role === 'admin') {
      message = 'Cannot change role of an admin user'
      return { message: message}
    }
    return prisma.user.update({
      where: { id },
      data: {
        role: 'admin',
      },
    });
  },

  async generateAndStoreResetCode(email: string) {
    const resetCode = generatePasswordResetCode();
    const user = await prisma.user.update({
      where: { email },
      data: { resetCode },
    });
    sendPasswordResetEmail(email, resetCode)
    return user;
  },

  async resetPassword(resetCode: string, email: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');
  
    if (user.resetCode !== resetCode) {
      throw new Error('Invalid or expired reset code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return prisma.user.update({
      where: { email },
      data: { password: hashedPassword, resetCode: null },
    });
  },
  
  async getAllUsersExceptAdmins() {
    return prisma.user.findMany({
      where: {
        role: { not: 'admin' },
      },
      include: {
        profile: true,
      },
    });
  },

  async getAttendeesForOrganizerEvents(organizerId: string) {
    const events = await prisma.event.findMany({
      where: {
        organizerId,
      },
      include: {
        registrations: {
          include: {
            user: {
              include: {
                profile: true,
                registrations: true
              },
            },
          },
        },
      },
    });

    const attendees = events.flatMap(event => event.registrations.map(registration => registration.user));
    return attendees;
  },
};

