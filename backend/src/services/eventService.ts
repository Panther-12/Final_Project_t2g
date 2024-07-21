import { PrismaClient } from '@prisma/client';
import { EventImageInput } from '../interfaces/eventImageInterface';

const prisma = new PrismaClient();

export const eventService = {
  async createEvent(title: string, description: string, startDateTime: Date, endDateTime: Date, venueId: string, organizerId: string, categoryId: string, images: string[]) {
    let message: string = ""
    // Fetch existing events at the venue that are active and within the time frame
    const conflictingEvents = await prisma.event.findMany({
      where: {
        venueId,
        status: 'active',
        OR: [
          {
            startDateTime: { lte: endDateTime },
            endDateTime: { gte: startDateTime },
          },
        ],
      },
    });

    if (conflictingEvents.length > 0) {
      message = 'The venue is already booked during the specified time frame.'
      return {message: message}
    }

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

  async updateEvent(id: string, title?: string, description?: string, startDateTime?: Date, endDateTime?: Date, venueId?: string, organizerId?: string, images?: string[] ) {
    let data = {
      title,
      description,
      startDateTime,
      endDateTime,
      venueId,
      organizerId,
    }
  const updatedEvent = await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      startDateTime,
      endDateTime,
      venueId,
      organizerId,
    },
    include: {
      venue: true,
      organizer: true,
    },
  });

  if (images !== undefined) {
    const eventImages = images.map((url) => ({
      eventId: id,
      url,
    }));

    await prisma.eventImage.createMany({
      data: eventImages,
    });
  }

  return updatedEvent;
},

  async deleteEvent(id: string) {
    return prisma.event.update({
      where: { id },
      data: {
        status: 'cancelled',
      }
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
