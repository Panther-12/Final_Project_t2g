import { Request, Response } from 'express';
import { eventService } from '../services/eventService';

export const eventController = {
  async createEvent(req: Request, res: Response) {
    const { title, description, startDateTime, endDateTime, venueId, organizerId, images } = req.body;

    try {
      const event = await eventService.createEvent(title, description, startDateTime, endDateTime, venueId, organizerId, images);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create event' });
    }
  },

  async getEventById(req: Request, res: Response) {
    const eventId = req.params.id;

    try {
      const event = await eventService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json(event);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  },

  async updateEvent(req: Request, res: Response) {
    const eventId = req.params.id;
    const { title, description, startDateTime, endDateTime, venueId, organizerId } = req.body;

    try {
      const updatedEvent = await eventService.updateEvent(eventId, { title, description, startDateTime, endDateTime, venueId, organizerId });
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update event' });
    }
  },

  async deleteEvent(req: Request, res: Response) {
    const eventId = req.params.id;

    try {
      await eventService.deleteEvent(eventId);
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete event' });
    }
  },

  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await eventService.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  },
};
