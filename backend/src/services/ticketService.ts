import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ticketService = {
  async createTicket(eventId: string, type: string, price: number) {
    return prisma.ticket.create({
      data: {
        eventId,
        type,
        price,
      },
      include: {
        event: true,
        registrations: true,
      },
    });
  },

  async getTicketById(id: string) {
    return prisma.ticket.findUnique({
      where: { id },
      include: {
        event: true,
        registrations: true,
      },
    });
  },

  async updateTicket(id: string, data: { type?: string; price?: number }) {
    return prisma.ticket.update({
      where: { id },
      data,
      include: {
        event: true,
        registrations: true,
      },
    });
  },

  async deleteTicket(id: string) {
    return prisma.ticket.delete({
      where: { id },
    });
  },

  async getAllTicketsForEvent(eventId: string) {
    return prisma.ticket.findMany({
      where: { eventId },
      include: {
        event: true,
        registrations: true,
      },
    });
  },

  async getAllTickets() {
    return prisma.ticket.findMany({
      include: {
        event: true,
        registrations: true,
      },
    });
  },
};
