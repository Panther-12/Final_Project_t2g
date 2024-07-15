import { Request, Response } from 'express';
import { ticketService } from '../services/ticketService';

export const ticketController = {
  async createTicket(req: Request, res: Response) {
    const { eventId, type, price } = req.body;

    try {
      const ticket = await ticketService.createTicket(eventId, type, price);
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  },

  async getTicketById(req: Request, res: Response) {
    const ticketId = req.params.id;

    try {
      const ticket = await ticketService.getTicketById(ticketId);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ticket' });
    }
  },

  async updateTicket(req: Request, res: Response) {
    const ticketId = req.params.id;
    const { type, price } = req.body;

    try {
      const updatedTicket = await ticketService.updateTicket(ticketId, { type, price });
      res.json(updatedTicket);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update ticket' });
    }
  },

  async deleteTicket(req: Request, res: Response) {
    const ticketId = req.params.id;

    try {
      await ticketService.deleteTicket(ticketId);
      res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete ticket' });
    }
  },

  async getAllTickets(req: Request, res: Response) {
    try {
      const tickets = await ticketService.getAllTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  },

  async getAllTicketsForEvent(req: Request, res: Response) {
    const eventId = req.params.eventId;

    try {
      const tickets = await ticketService.getAllTicketsForEvent(eventId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tickets for event' });
    }
  },
};
