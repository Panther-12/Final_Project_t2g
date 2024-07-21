import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ticketService = {
  async createTicket(eventId: string, type: string, price: number, quantity: number) {
    return prisma.ticket.create({
      data: {
        eventId,
        type,
        price,
        quantity,
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

  async updateTicket(id: string, data: { type?: string; price?: number, quantity?: number }) {
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

  async getAllTicketsForOrganizer(organizerId: string) {
    // Fetch all events for the given organizer
    const events = await prisma.event.findMany({
      where: {
        organizerId,
      },
      include: {
        tickets: {
          include: {
            event: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });
  
    const ticketsWithEventTitle = events.flatMap(event => 
      event.tickets.map(ticket => ({
        ...ticket,
        eventTitle: event.title
      }))
    );
  
    return ticketsWithEventTitle;
  },
}
