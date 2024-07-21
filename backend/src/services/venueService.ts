import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const venueService = {
  async createVenue(name: string, address: string, capacity: number, type: string) {
    let message: string = ""
    // Convert type to lowercase and validate
    type = type.toLowerCase();
    if (type !== 'public' && type !== 'private') {
        message = 'Type must be either "public" or "private".'
        return { message: message}
    }
    
    return prisma.venue.create({
      data: {
        name,
        address,
        capacity,
        type,
      },
    });
  },

  async getVenueById(id: string) {
    return prisma.venue.findUnique({
      where: { id },
    });
  },

  async getAllVenues() {
    return prisma.venue.findMany({
      where: {
        type: 'public'
      }
    });
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
