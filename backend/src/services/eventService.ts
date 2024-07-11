import { PrismaClient } from '@prisma/client';
import { EventImageInput } from '../interfaces/eventImageInterface';

const prisma = new PrismaClient();

export const eventService = {
  async createEvent(title: string, description: string, startDateTime: Date, endDateTime: Date, venueId: string, organizerId: string, images: EventImageInput[]) {
    return prisma.event.create({
      data: {
        title,
        description,
        startDateTime,
        endDateTime,
        venueId,
        organizerId,
        images: {
          createMany: {
            data: images.map(image => ({ url: image.url })),
          },
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

  async updateEvent(id: string, data: { title?: string; description?: string; startDateTime?: Date; endDateTime?: Date; venueId?: string; organizerId?: string }) {
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
};
