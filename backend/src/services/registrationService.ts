import { Event, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registrationService = {
  async registerUserForEvent(eventId: string, userId: string, ticketIds: string[]) {
    let message: string = ''
    try {
      // Fetch the event details to check its status
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { status: true },
      }) as Event;

      if (!event) {
        message = `Event with id ${eventId} not found`
        return {message: message}
      }

      if (event.status === 'cancelled') {
        message = 'Cannot register for a cancelled event'
        return {message: message}
      }

      // Check if the user is already registered for this event
      const existingRegistration = await prisma.registration.findFirst({
        where: {
          eventId,
          userId,
        },
      });

      if (existingRegistration) {
        if (existingRegistration.status === 'active') {
          message = 'User is already registered for this event';
          return { message: message };
        } else {
          // Update the existing registration to active
          await prisma.registration.update({
            where: { id: existingRegistration.id },
            data: { status: 'active' },
          });
          message = 'User registration status updated to active';
          return { message: message };
        }
      }

      // Check ticket availability and update quantities
      for (const ticketId of ticketIds) {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

        if (!ticket) {
          message = `Ticket with id ${ticketId} not found`
          return { message: message };
        }

        if (ticket.quantity < 1) {
          message = `Insufficient quantity for ticket id ${ticketId}`
          return { message: message };
        }

        await prisma.ticket.update({
          where: { id: ticketId },
          data: { quantity: ticket.quantity - 1 },
        });
      }

      // Create the registration
      const registration = await prisma.registration.create({
        data: {
          eventId,
          userId,
          status: 'active',
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
    return prisma.registration.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
      include: {
        event: true,
        user: true,
        tickets: true,
      },
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

  async getAllRegistrations() {
    return prisma.registration.findMany({
      include: {
        event: true,
        user: true,
        tickets: true,
      },
    });
  },

  async getAllRegistrationsByOrganizer(organizerId: string) {
    return prisma.registration.findMany({
      where: {
        event: {
          organizerId: organizerId,
        },
      },
      include: {
        event: true,
        user: true,
        tickets: true,
      },
    });
  },
};
