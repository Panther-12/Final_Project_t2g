import { Request, Response } from 'express';
import { eventService } from '../services/eventService';
import { sendEventCreationConfirmationEmail } from '../utils/emailUtils';
import { userService } from '../services/userService';
import { User } from '@prisma/client';

export const eventController = {
  async createEvent(req: Request, res: Response) {
    const { title, description, startDateTime, endDateTime, venueId, organizerId, categoryId, images} = req.body;

    try {
      const event = await eventService.createEvent(title, description, startDateTime, endDateTime, venueId, organizerId, categoryId, images);
      // // Send confirmation email to the organizer
      // const organizer = await userService.getUserById(organizerId) as User;
      // await sendEventCreationConfirmationEmail(organizer.email, title, startDateTime, endDateTime, venueId);
    
      res.status(201).json(event);
    } catch (error) {
      console.log(error)
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
    const { title, description, startDateTime, endDateTime, venueId, organizerId, images } = req.body;

    try {
      const updatedEvent = await eventService.updateEvent(eventId, title, description, startDateTime, endDateTime, venueId, organizerId, images);
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update event' });
    }
  },

  async deleteEvent(req: Request, res: Response) {
    const eventId = req.params.id;

    try {
      await eventService.deleteEvent(eventId);
      res.json({ message: 'Event cancelled successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to cancel event' });
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

  async getEventsByOrganizer(req: Request, res: Response) {
    const { organizerId } = req.params;
    try {
      const events = await eventService.getEventsByOrganizer(organizerId);
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get organizer\'s events' });
    }
  },

  async getAllEventsForUser(req: Request, res: Response) {
    const userId = req.params.userId;

    try {
      const events = await eventService.getAllEventsForUser(userId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events for user' });
    }
  },
};
