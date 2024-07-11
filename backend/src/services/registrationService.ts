import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registrationService = {
  async registerUserForEvent(eventId: string, userId: string, ticketIds: string[]) {
    try {
      const registration = await prisma.registration.create({
        data: {
          eventId,
          userId,
          status: 'pending',
          tickets: {
            connect: ticketIds.map(ticketId => ({ id: ticketId })),
          },
        },
        include: {
          tickets: true,
        },
      });
  
      return registration;
    } catch (error) {
      throw new Error(`Failed to register user for event: ${error}`);
    }
  },

  async getRegistrationById(id: string) {
    return prisma.registration.findUnique({
      where: { id },
      include: {
        event: true,
        user: true,
        tickets: true,
      },
    });
  },

  async updateRegistration(id: string, data: { status: string }) {
    return prisma.registration.update({
      where: { id },
      data,
      include: {
        event: true,
        user: true,
        tickets: true,
      },
    });
  },

  async deleteRegistration(id: string) {
    return prisma.registration.delete({
      where: { id },
    });
  },

  async getAllRegistrationsForUser(userId: string) {
    return prisma.registration.findMany({
      where: { userId },
      include: {
        event: true,
        user: true,
        tickets: true,
      },
    });
  },
};
