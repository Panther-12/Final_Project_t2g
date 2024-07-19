import { PrismaClient } from '@prisma/client';
import { EventImageInput } from '../interfaces/eventImageInterface';

const prisma = new PrismaClient();

export const eventService = {
  async createEvent(title: string, description: string, startDateTime: Date, endDateTime: Date, venueId: string, organizerId: string, categoryId: string, images: string[]) {
    console.log(images)
    return prisma.event.create({
      data: {
        title,
        description,
        startDateTime,
        endDateTime,
        venueId,
        organizerId,
        categoryId,
        images: {
          create: images.map((url) => ({url})),
        }
      },
      include: {
        venue: true,
        organizer: true,
        images: true,
      },
    });
  },

  async getEventById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        venue: true,
        organizer: true,
        tickets: true,
        registrations: true,
        images: true,
      },
    });
  },

  async updateEvent(id: string, title?: string, description?: string, startDateTime?: Date, endDateTime?: Date, venueId?: string, organizerId?: string ) {
    let data = {
      title,
      description,
      startDateTime,
      endDateTime,
      venueId,
      organizerId
    }
    return prisma.event.update({
      where: { id },
      data,
      include: {
        venue: true,
        organizer: true,
      },
    });
  },

  async deleteEvent(id: string) {
    await prisma.eventImage.deleteMany({
      where: {
        eventId: id
      },
    });
    return prisma.event.delete({
      where: { id },
    });
  },

  async getAllEvents() {
    return prisma.event.findMany({
      include: {
        venue: true,
        organizer: true,
      },
    });
  },

  async getEventsByOrganizer(organizerId: string) {
    return prisma.event.findMany({
      where: { organizerId },
      include: {
        venue: true,
        organizer: true,
        images: true,
      },
    });
  },

  async getAllEventsForUser(userId: string) {
    return prisma.event.findMany({
      where: {
        registrations: {
          some: {
            userId: userId,
            status: {
              not: 'cancelled',
            },
          },
        },
      },
      include: {
        venue: true,
        organizer: true,
        tickets: true,
        registrations: true,
        images: true,
      },
    });
  },
};
