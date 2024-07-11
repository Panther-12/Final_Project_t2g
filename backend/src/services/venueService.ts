import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const venueService = {
  async createVenue(name: string, address: string, capacity: number) {
    return prisma.venue.create({
      data: {
        name,
        address,
        capacity,
      },
    });
  },

  async getVenueById(id: string) {
    return prisma.venue.findUnique({
      where: { id },
    });
  },

  async getAllVenues() {
    return prisma.venue.findMany();
  },

  async updateVenue(id: string, data: { name?: string; address?: string; capacity?: number }) {
    return prisma.venue.update({
      where: { id },
      data,
    });
  },

  async deleteVenue(id: string) {
    await prisma.venue.delete({
      where: { id },
    });
  },
};
